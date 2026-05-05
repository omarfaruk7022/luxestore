import { getRequests } from '@/backend/controllers/storeRequest.controller.js';
import { NextResponse } from 'next/server';

function superAdminGuard(req) {
  const key = req.headers.get('x-super-admin-key');
  if (key !== process.env.SUPER_ADMIN_KEY) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }
  return null;
}

export async function GET(req) {
  const guard = superAdminGuard(req);
  if (guard) return guard;
  return getRequests(req);
}
