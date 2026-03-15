import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { NextResponse } from 'next/server';
import connectDB from '../config/db.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req) => {
  try {
    await connectDB();
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice slug');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, variantId, size, color, colorHex, quantity = 1 } = body;

    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    const variant = product.variants.find((v) => v._id.toString() === variantId);
    if (!variant) return NextResponse.json({ success: false, message: 'Variant not found' }, { status: 404 });
    if (variant.stock < quantity) {
      return NextResponse.json({ success: false, message: 'Insufficient stock' }, { status: 400 });
    }

    const price = product.discountPrice || product.price;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variantId?.toString() === variantId
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({
        product: productId, variantId, size, color, colorHex,
        quantity, price, name: product.name, image: product.images[0],
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice slug');
    return NextResponse.json({ success: true, message: 'Added to cart', cart });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, itemId) => {
  try {
    await connectDB();
    const body = await req.json();
    const { quantity } = body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });

    const item = cart.items.id(itemId);
    if (!item) return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice slug');
    return NextResponse.json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Remove cart item
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = async (req, itemId) => {
  try {
    await connectDB();
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice slug');
    return NextResponse.json({ success: true, message: 'Item removed', cart });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req) => {
  try {
    await connectDB();
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], discount: 0, coupon: null });
    return NextResponse.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
