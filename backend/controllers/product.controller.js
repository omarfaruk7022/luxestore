import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { NextResponse } from "next/server";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

// Get all products

export const getProducts = async (req) => {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "-createdAt";
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("newArrival");
    const bestSeller = searchParams.get("bestSeller");
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    const query = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) query.$text = { $search: search };
    if (featured === "true") query.isFeatured = true;
    if (newArrival === "true") query.isNewArrival = true;
    if (bestSeller === "true") query.isBestSeller = true;
    if (size) query["variants.size"] = size;
    if (color) query["variants.color"] = { $regex: color, $options: "i" };

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Get single product
export const getProduct = async (slug) => {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select("name slug price discountPrice images rating numReviews");

    return NextResponse.json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Featured products
export const getFeaturedProducts = async () => {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .limit(8)
      .sort("-createdAt");

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Create product
export const createProduct = async (req) => {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.create(body);
    await product.populate("category", "name slug");

    return NextResponse.json(
      {
        success: true,
        message: "Product created",
        product,
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

// Update product
export const updateProduct = async (req, id) => {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");
    console.log(product);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, { isActive: false });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
