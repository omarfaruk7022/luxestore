import connectDB from "../config/db.js";
import Category from "../models/category.model.js";
import { NextResponse } from "next/server";

// Get all categories
export const getCategories = async () => {
  try {
    await connectDB(); // ⭐ DB connect

    const categories = await Category.find({ isActive: true }).sort(
      "sortOrder",
    );

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Get single category
export const getCategory = async (slug) => {
  try {
    await connectDB();

    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Create category
export const createCategory = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    const category = await Category.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Category created",
        category,
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

// Update category
export const updateCategory = async (req, id) => {
  try {
    await connectDB();

    const body = await req.json();

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated",
      category,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    await connectDB();

    await Category.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
