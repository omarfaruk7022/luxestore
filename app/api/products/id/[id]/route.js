import {
  updateProduct,
  deleteProduct,
} from "@/backend/controllers/product.controller.js";

import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const admin = adminOnly(auth.user);
  if (!admin.success) return admin;
  const { id } = await params;
  return updateProduct(req, id);
}

export async function DELETE(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const admin = adminOnly(auth.user);
  if (!admin.success) return admin;
  const { id } = await params;
  return deleteProduct(id);
}
