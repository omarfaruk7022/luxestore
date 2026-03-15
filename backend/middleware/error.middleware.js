import { NextResponse } from 'next/server';

// Note: In Next.js App Router, traditional Express error handling middleware isn't used.
// Instead, you usually try/catch inside the route and handle errors there, or use a custom wrapper.
// This utility can be exported to format the error caught in the catch block of route handlers.
export const errorHandler = (err, defaultStatusCode = 500) => {
  let statusCode = defaultStatusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  return NextResponse.json(
    {
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    { status: statusCode }
  );
};
