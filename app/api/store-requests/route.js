import { submitRequest } from '@/backend/controllers/storeRequest.controller.js';

export async function POST(req) {
  return submitRequest(req);
}
