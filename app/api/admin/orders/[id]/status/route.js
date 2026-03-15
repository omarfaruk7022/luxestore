import { updateOrderStatus } from "@/backend/controllers/admin.controller.js";
import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req, { params }) {
  await protect(req);
  await adminOnly(req);
  const { id } = await params;
  return updateOrderStatus(req, id);
}
