import { login } from "@/backend/controllers/auth.controller.js";

export async function POST(req) {
  return login(req);
}
