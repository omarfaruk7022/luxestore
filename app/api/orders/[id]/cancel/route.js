import { cancelOrder } from "@/backend/controllers/order.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const { id } = await params;
  return cancelOrder(req, id);
}
