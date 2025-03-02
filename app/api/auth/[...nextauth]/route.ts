/* eslint-disable no-inline-comments */
import { genericValidationAj } from "@/lib/arcjet/ArcjetRules";
import { authOptions } from "@/lib/nextAuth/AuthOptions";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

export interface CredentialsInterface {
  email: string;
  password: string;
}

const handler = NextAuth(authOptions)

const ajProtectedPOST = async (req: Request, res: Response) => {
  // Protect with Arcjet
  const decision = await genericValidationAj.protect(req);
    
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  // Then call the original handler
  return handler(req, res);
};

export {
  handler as GET, ajProtectedPOST as POST 
};