import { changePassword } from "@/backend/controllers/auth.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return changePassword(req);
}
