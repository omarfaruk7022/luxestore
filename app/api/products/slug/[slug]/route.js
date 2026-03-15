import { getProduct } from "@/backend/controllers/product.controller.js";

export async function GET(req, { params }) {
  const { slug } = await params;   

  return getProduct(slug);
}