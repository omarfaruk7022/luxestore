import {
  updateCategory,
  deleteCategory,
} from "@/backend/controllers/category.controller.js";
import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  await adminOnly(req);
  return updateCategory(req, params.id);
}

export async function DELETE(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  await adminOnly(req);
  return deleteCategory(req, params.id);
}
