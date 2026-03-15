import { getAllUsers } from "@/backend/controllers/admin.controller.js";
import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  await protect(req);
  await adminOnly(req);
  return getAllUsers(req);
}
