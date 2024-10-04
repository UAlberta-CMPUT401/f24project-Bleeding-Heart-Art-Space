import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

export const firebaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    res.status(401).json({ error: 'No auth header token provided' });
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}
