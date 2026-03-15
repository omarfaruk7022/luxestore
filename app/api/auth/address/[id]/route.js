import { deleteAddress } from "@/backend/controllers/auth.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function DELETE(req, { params }) {
  await protect(req);
  const { id } = await params;
  return deleteAddress(req, id);
}
