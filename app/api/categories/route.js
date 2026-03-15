import {
  getCategories,
  createCategory,
} from "@/backend/controllers/category.controller.js";
import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";

export async function GET(req) {
  return getCategories(req);
}

export async function POST(req) {
  await protect(req);
  await adminOnly(req);
  return createCategory(req);
}
