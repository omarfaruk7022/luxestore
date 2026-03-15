import {
  updateCartItem,
  removeCartItem,
} from "@/backend/controllers/cart.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const { itemId } = await params;
  return updateCartItem(req, itemId);
}

export async function DELETE(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const { itemId } = await params;
  return removeCartItem(req, itemId);
}
