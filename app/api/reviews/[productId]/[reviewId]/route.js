import { deleteReview } from "@/backend/controllers/review.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function DELETE(req, { params }) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  req.user = auth.user;
  const { productId, reviewId } = await params;
  return deleteReview(req, productId, reviewId);
}
