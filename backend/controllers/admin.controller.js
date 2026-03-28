import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import { NextResponse } from "next/server";
import connectDB from "../config/db.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req) => {
  try {
    await connectDB();
    const [totalOrders, totalProducts, totalUsers, totalCategories] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments({ isActive: true }),
        User.countDocuments({ role: "user" }),
        Category.countDocuments({ isActive: true }),
      ]);

    const pendingOrders = await Order.countDocuments({ orderStatus: "placed" });
    const processingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });

    // Revenue, cost, profit
    const profitAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          totalCost: {
            $sum: { $multiply: ["$items.purchasePrice", "$items.quantity"] },
          },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalCost: 1,
          totalProfit: { $subtract: ["$totalRevenue", "$totalCost"] },
        },
      },
    ]);

    const totalRevenue = profitAgg[0]?.totalRevenue || 0;
    const totalCost = profitAgg[0]?.totalCost || 0;
    const totalProfit = profitAgg[0]?.totalProfit || 0;

    // Revenue last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Product.find({ isActive: true })
      .sort("-sold")
      .limit(5)
      .select("name images basePrice sold rating");

    // Recent orders
    const recentOrders = await Order.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "name email");

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalCategories,
        totalRevenue,
        totalCost,
        totalProfit,
        pendingOrders,
        processingOrders,
      },
      dailyRevenue,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

export const getRevenueStats = async (req) => {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const period = searchParams.get("period") || "daily";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let matchFrom, groupFormat;
    const now = new Date();

    if (from && to) {
      // custom range
      matchFrom = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      const diffDays = Math.ceil((toDate - matchFrom) / (1000 * 60 * 60 * 24));
      groupFormat =
        diffDays <= 1 ? "%H" : diffDays <= 60 ? "%Y-%m-%d" : "%Y-%m";

      const data = await Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: matchFrom, $lte: toDate },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
            cost: {
              $sum: { $multiply: ["$items.purchasePrice", "$items.quantity"] },
            },
            orders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            revenue: 1,
            cost: 1,
            profit: { $subtract: ["$revenue", "$cost"] },
            orders: 1,
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return NextResponse.json({ success: true, data, period: "custom" });
    }

    if (period === "daily") {
      matchFrom = new Date(new Date().setHours(0, 0, 0, 0));
      groupFormat = "%H";
    } else if (period === "weekly") {
      matchFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      groupFormat = "%Y-%m-%d";
    } else if (period === "monthly") {
      matchFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      groupFormat = "%Y-%m-%d";
    } else if (period === "yearly") {
      matchFrom = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
      groupFormat = "%Y-%m";
    }

    const data = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: matchFrom } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          cost: {
            $sum: { $multiply: ["$items.purchasePrice", "$items.quantity"] },
          },
          orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          revenue: 1,
          cost: 1,
          profit: { $subtract: ["$revenue", "$cost"] },
          orders: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({ success: true, data, period });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req) => {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");

    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email phone")
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

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, id) => {
  try {
    await connectDB();
    const body = await req.json();
    const { orderStatus, paymentStatus, trackingNumber, note } = body;
    const order = await Order.findById(id);
    if (!order)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        note: note || `Status updated to ${orderStatus}`,
      });
      if (orderStatus === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    return NextResponse.json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req) => {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const search = searchParams.get("search");

    const query = {};
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
    return NextResponse.json({
      success: true,
      users,
      pagination: { page, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
export const toggleUserStatus = async (req, id) => {
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    if (user.role === "admin")
      return NextResponse.json(
        { success: false, message: "Cannot modify admin accounts" },
        { status: 403 },
      );
    user.isActive = !user.isActive;
    await user.save();
    return NextResponse.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
