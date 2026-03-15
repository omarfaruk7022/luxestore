import { register } from "@/backend/controllers/auth.controller.js";

export async function POST(req) {
  return register(req);
}
