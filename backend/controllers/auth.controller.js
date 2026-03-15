import { NextResponse } from "next/server";
import User from "../models/user.model.js";
import { sendTokenResponse } from "../utils/jwt.utils.js";
import connectDB from "../config/db.js";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    const user = await User.create({ name, email, password });
    return sendTokenResponse(user, 201, "Account created successfully");
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account has been deactivated" },
        { status: 403 },
      );
    }
    return sendTokenResponse(user, 200, "Login successful");
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req) => {
  try {
    await connectDB();
    return NextResponse.json({ success: true, user: req.user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, phone, avatar } = body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true },
    );
    return NextResponse.json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { currentPassword, newPassword } = body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword))) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }
    user.password = newPassword;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Add/Update address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const user = await User.findById(req.user._id);
    if (body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }
    user.addresses.push(body);
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Address added",
      addresses: user.addresses,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/address/:id
// @access  Private
export const deleteAddress = async (req, id) => {
  try {
    await connectDB();
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== id);
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Address removed",
      addresses: user.addresses,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
