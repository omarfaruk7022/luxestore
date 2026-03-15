import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import { NextResponse } from 'next/server';
import connectDB from '../config/db.js';

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req) => {
  try {
    await connectDB();
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug price discountPrice images rating numReviews');
    return NextResponse.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, productId) => {
  try {
    await connectDB();
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(productId);
    let added;
    if (idx > -1) { user.wishlist.splice(idx, 1); added = false; }
    else { user.wishlist.push(productId); added = true; }
    await user.save();
    return NextResponse.json({ success: true, message: added ? 'Added to wishlist' : 'Removed from wishlist', added });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
