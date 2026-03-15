import { getCategory } from "@/backend/controllers/category.controller.js";

export async function GET(req, { params }) {
  return getCategory(req, params.slug);
}
