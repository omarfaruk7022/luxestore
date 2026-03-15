import { getFeaturedProducts } from "@/backend/controllers/product.controller.js";

export async function GET(req) {
  return getFeaturedProducts(req);
}
