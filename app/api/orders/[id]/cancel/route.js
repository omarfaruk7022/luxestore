import { cancelOrder } from "@/backend/controllers/order.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req, { params }) {
  console.log("starting cancel route");

  const auth = await protect(req);
  if (!auth.success) return auth;

  req.user = auth.user;

  const p = await params;
  console.log("params:", p);
  const { id } = p;

  return cancelOrder(req, id);
}
