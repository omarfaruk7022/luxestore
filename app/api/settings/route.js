import { getSettings, updateSettings } from '@/backend/controllers/settings.controller.js';
import { protect, adminOnly } from '@/backend/middleware/auth.middleware.js';
import { NextResponse } from 'next/server';

export async function GET() {
  return getSettings();
}

export async function PUT(req) {
  const auth = await protect(req);
  if (!auth.success) return auth;
  const admin = adminOnly(auth.user);
  if (!admin.success) return admin;
  return updateSettings(req);
}
