import { changePassword } from "@/backend/controllers/auth.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function PUT(req) {
  await protect(req);
  return changePassword(req);
}
