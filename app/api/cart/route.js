import {
  getCart,
  addToCart,
  clearCart,
} from "@/backend/controllers/cart.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return getCart(req);
}

export async function POST(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return addToCart(req);
}

export async function DELETE(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return clearCart(req);
}
