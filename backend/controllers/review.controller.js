import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import { NextResponse } from 'next/server';
import connectDB from '../config/db.js';

// @desc    Add review
// @route   POST /api/reviews/:productId
// @access  Private
export const addReview = async (req, productId) => {
  try {
    await connectDB();
    const body = await req.json();
    const { rating, comment } = body;
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    // Check already reviewed
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return NextResponse.json({ success: false, message: 'Product already reviewed' }, { status: 400 });

    // Verify purchase
    const hasPurchased = await Order.findOne({
      user: req.user._id, 'items.product': product._id, orderStatus: 'delivered',
    });
    if (!hasPurchased) {
      return NextResponse.json({ success: false, message: 'You can only review products you have purchased and received' }, { status: 403 });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    await product.save();
    return NextResponse.json({ success: true, message: 'Review added', reviews: product.reviews }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private
// Assumes you might pass both as parameters, or handle it uniquely in Next.js router.
export const deleteReview = async (req, productId, reviewId) => {
  try {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    const review = product.reviews.id(reviewId);
    if (!review) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    product.reviews.pull(reviewId);
    await product.save();
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
