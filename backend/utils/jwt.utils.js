import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

export const sendTokenResponse = (user, statusCode, message = 'Success') => {
  const token = generateToken(user._id);
  return NextResponse.json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  }, { status: statusCode });
};
