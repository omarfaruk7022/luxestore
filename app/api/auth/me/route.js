import { getMe } from "@/backend/controllers/auth.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  await protect(req);
  return getMe(req);
}
