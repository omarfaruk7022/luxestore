import { toggleWishlist } from "@/backend/controllers/user.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function POST(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const { productId } = await params;
  return toggleWishlist(req, productId);
}
