import {
  createOrder,
  getMyOrders,
} from "@/backend/controllers/order.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return getMyOrders(req);
}

export async function POST(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return createOrder(req);
}
