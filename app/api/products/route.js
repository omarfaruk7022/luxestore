import { NextResponse } from "next/server";
import {
  getProducts,
  createProduct,
} from "@/backend/controllers/product.controller.js";

import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  return getProducts(req);
}

export async function POST(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  await adminOnly(req);

  return createProduct(req);
}
