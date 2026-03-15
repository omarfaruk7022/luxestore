import { getWishlist } from "@/backend/controllers/user.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  return getWishlist(req);
}
