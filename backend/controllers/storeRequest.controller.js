import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import StoreRequest from "../models/storeRequest.model.js";
import connectDB from "../config/db.js";

// POST /api/store-requests — client submits registration
export const submitRequest = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { storeName, ownerName, email, phone, businessType, message } = body;

    if (!storeName || !ownerName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "storeName, ownerName, email, phone are required",
        },
        { status: 400 },
      );
    }

    // Prevent duplicate pending requests from same email
    const existing = await StoreRequest.findOne({ email, status: "pending" });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A request from this email is already pending",
        },
        { status: 400 },
      );
    }

    const request = await StoreRequest.create({
      storeName,
      ownerName,
      email,
      phone,
      businessType,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request submitted! We will contact you within 24 hours.",
        request,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// GET /api/super-admin/requests — list all requests (super admin)
export const getRequests = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const query = status ? { status } : {};
    const requests = await StoreRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// POST /api/super-admin/requests/[id]/approve — approve and auto-create DB
export const approveRequest = async (req, id) => {
  try {
    await connectDB();
    const request = await StoreRequest.findById(id);
    if (!request)
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 },
      );
    if (request.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Request already processed" },
        { status: 400 },
      );
    }

    // Generate unique DB name from store name
    const slug = request.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 20);
    const suffix = Date.now().toString(36);
    const dbName = `luxe_${slug}_${suffix}`;

    // Generate temp password
    const tempPassword = Math.random().toString(36).slice(-8) + "X1!";

    // AUTO-CREATE DB: connect to new dbName — MongoDB creates it on first write
    await autoCreateTenantDB(dbName, {
      storeName: request.storeName,
      adminEmail: request.email,
      adminPassword: tempPassword,
      adminName: request.ownerName,
    });

    // Update request record
    request.status = "approved";
    request.dbName = dbName;
    request.adminEmail = request.email;
    request.adminPassword = tempPassword; // store once, shown to super admin
    request.approvedAt = new Date();
    await request.save();
    // Send credentials email
    try {
      const { sendStoreCredentials } = await import("../../lib/mailer.js");
      await sendStoreCredentials({
        to: request.email,
        storeName: request.storeName,
        adminEmail: request.email,
        tempPassword,
        ownerName: request.ownerName,
      });
    } catch (mailErr) {
      console.error("Mail failed:", mailErr.message);
      // Don't block the response if mail fails
    }

    return NextResponse.json({
      success: true,
      message: "Store approved and DB created!",
      credentials: {
        dbName,
        adminEmail: request.email,
        tempPassword,
        storeName: request.storeName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// POST /api/super-admin/requests/[id]/reject
export const rejectRequest = async (req, id) => {
  try {
    await connectDB();
    const body = await req.json();
    const request = await StoreRequest.findById(id);
    if (!request)
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 },
      );

    request.status = "rejected";
    request.rejectedReason = body.reason || "";
    await request.save();

    return NextResponse.json({ success: true, message: "Request rejected" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// ─── Auto DB Creation ────────────────────────────────────────────────────────
async function autoCreateTenantDB(
  dbName,
  { storeName, adminEmail, adminPassword, adminName },
) {
  const baseUri = process.env.MONGO_URI;

  // Build URI for the new DB
  const uri = buildDbUri(baseUri, dbName);

  // Create isolated connection — MongoDB auto-creates the DB on first write
  const conn = await mongoose
    .createConnection(uri, { bufferCommands: false })
    .asPromise();

  // Register minimal schemas on this connection
  const { userSchema, settingsSchema } = getSchemas();
  const User = conn.model("User", userSchema);
  const Settings = conn.model("Settings", settingsSchema);

  // Seed settings
  await Settings.create({
    storeName,
    activeTemplate: "luxe",
    colors: {},
  });

  // Seed admin user (password will be hashed by pre-save hook)
  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  await conn.close();
}

function buildDbUri(baseUri, dbName) {
  try {
    const url = new URL(baseUri);
    url.pathname = `/${dbName}`;
    return url.toString();
  } catch {
    return baseUri.replace(/\/[^/?]+(\?|$)/, `/${dbName}$1`);
  }
}

function getSchemas() {
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["user", "admin"], default: "user" },
      avatar: { type: String, default: "" },
      phone: { type: String, default: "" },
      addresses: [],
      wishlist: [],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
  );

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  const settingsSchema = new mongoose.Schema(
    {
      storeName: { type: String, default: "My Store" },
      tagline: { type: String, default: "" },
      logo: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        youtube: String,
      },
      activeTemplate: { type: String, default: "luxe" },
      colors: { type: mongoose.Schema.Types.Mixed, default: {} },
      currency: { type: String, default: "BDT" },
      currencySymbol: { type: String, default: "৳" },
      freeShippingThreshold: { type: Number, default: 999 },
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
    { timestamps: true },
  );

  return { userSchema, settingsSchema };
}
