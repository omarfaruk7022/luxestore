import { addAddress } from "@/backend/controllers/auth.controller.js";
import { protect } from "@/backend/middleware/auth.middleware.js";

export async function POST(req) {
  await protect(req);
  return addAddress(req);
}
