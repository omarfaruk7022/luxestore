// Note: express-validator relies deeply on Express.js request objects.
// In Next.js, it's often easier to validate using Zod or a manual try/catch.
// However, if you have parsed the body and want to use this pattern:
// You can build a small Next-compatible validation wrapper or rely on Zod.

import { validationResult } from 'express-validator';
import { NextResponse } from 'next/server';

export const validate = async (req) => {
  // If you are using express-validator's `check()` chain, it usually expects to be run
  // as an array of middlewares. Since Next.js doesn't support that directly,
  // we are adapting this to check for errors manually if the req object was somehow patched.
  // We recommend using Zod or Yup directly on `req.json()` instead.
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      },
      { status: 400 }
    );
  }
  
  return { success: true };
};
