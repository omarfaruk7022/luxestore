import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { NextResponse } from "next/server";
import connectDB from "../config/db.js";

const SHIPPING_RATES = { standard: 60, express: 120, overnight: 250 };

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const {
      items,
      shippingAddress,
      shippingMethod = "standard",
      paymentMethod,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found` },
          { status: 404 },
        );
      }

      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString(),
      );
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${product.name} (${variant?.size}/${variant?.color})`,
          },
          { status: 400 },
        );
      }

      variant.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex,
        quantity: item.quantity,
        price,
      });
    }

    const shippingCost = SHIPPING_RATES[shippingMethod] || 60;
    const total = subtotal + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      shippingMethod,
      shippingCost,
      subtotal,
      discount: 0,
      tax: 0,
      total,
      paymentMethod,
      notes,
      statusHistory: [{ status: "placed", note: "Order placed successfully" }],
    });

    await order.populate("user", "name email");
    return NextResponse.json(
      { success: true, message: "Order placed successfully", order },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req) => {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      orders,
      pagination: { page, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, id) => {
  try {
    await connectDB();
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, id) => {
    console.log("1.  starting");

  try {
    console.log("1. connecting db");
    await connectDB();
    console.log("2. parsing body");
    const body = await req.json().catch(() => ({}));
    console.log("3. finding order", id);
    const order = await Order.findOne({ _id: id, user: req.user._id });
    console.log("4. order found", order);
    if (!order)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    if (!["placed", "confirmed"].includes(order.orderStatus)) {
      return NextResponse.json(
        { success: false, message: "Order cannot be cancelled at this stage" },
        { status: 400 },
      );
    }
    order.orderStatus = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      note: body.reason || "Cancelled by customer",
    });
    await order.save();
    return NextResponse.json({
      success: true,
      message: "Order cancelled",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
