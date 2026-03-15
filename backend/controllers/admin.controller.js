import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Category from '../models/category.model.js';
import { NextResponse } from 'next/server';
import connectDB from '../config/db.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req) => {
  try {
    await connectDB();
    const [totalOrders, totalProducts, totalUsers, totalCategories] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Category.countDocuments({ isActive: true }),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });

    // Revenue last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Product.find({ isActive: true })
      .sort('-sold')
      .limit(5)
      .select('name images price sold rating');

    // Recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email');

    return NextResponse.json({
      success: true,
      stats: { totalOrders, totalProducts, totalUsers, totalCategories, totalRevenue, pendingOrders, processingOrders },
      dailyRevenue,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
      .populate('user', 'name email phone')
      .sort('-createdAt').skip(skip).limit(limit);

    return NextResponse.json({ success: true, orders, pagination: { page, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({ status: orderStatus, note: note || `Status updated to ${orderStatus}` });
      if (orderStatus === 'delivered') { order.isDelivered = true; order.deliveredAt = new Date(); }
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') { order.isPaid = true; order.paidAt = new Date(); }
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    return NextResponse.json({ success: true, message: 'Order updated', order });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(limit);
    return NextResponse.json({ success: true, users, pagination: { page, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
export const toggleUserStatus = async (req, id) => {
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    if (user.role === 'admin') return NextResponse.json({ success: false, message: 'Cannot modify admin accounts' }, { status: 403 });
    user.isActive = !user.isActive;
    await user.save();
    return NextResponse.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
