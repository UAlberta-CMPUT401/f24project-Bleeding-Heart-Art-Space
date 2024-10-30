import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export interface AuthenticatedRequest extends Request {
  auth: DecodedIdToken;
}

export const isAuthenticated = (req: Request): req is AuthenticatedRequest => {
  return req.auth !== undefined && req.auth.uid !== undefined;
};
