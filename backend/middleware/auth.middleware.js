import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { NextResponse } from 'next/server';

export const protect = async (req) => {
  let token;
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) return NextResponse.json({ success: false, message: 'Not authorized, no token' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 });
    
    // In Next.js App Router middleware, we usually return the user or attach it in another way
    // For these helper functions, returning the user object is common so the route handler can use it.
    return { success: true, user };
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Token invalid or expired' }, { status: 401 });
  }
};

export const adminOnly = (user) => {
  if (user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Admin access only' }, { status: 403 });
  }
  return { success: true };
};

export const optionalAuth = async (req) => {
  let token;
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      return { user };
    } catch {
      // Ignore token errors for optional auth
    }
  }
  return { user: null };
};
