import { NextResponse } from "next/server";
import { protect, adminOnly } from "@/backend/middleware/auth.middleware.js";
import { getRevenueStats } from "@/backend/controllers/admin.controller.js";

export async function GET(req) {
  await protect(req);
  await adminOnly(req);
  return getRevenueStats(req);
}