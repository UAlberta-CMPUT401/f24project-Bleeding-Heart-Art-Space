import { UsersService } from "@/features/users/users.service";
import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { container } from "tsyringe";

/*
 * Checks the user is signed in to Firebase by verifying the token
 */
export const firebaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const idToken = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.split('Bearer ')[1] : authorizationHeader;

  if (!idToken) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.auth = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/*
 * Checks that user is linked to a User in the database (should use firebaseAuthMiddleware first)
 */
export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.auth;
  if (!auth) {
    return res.status(401).json({ error: 'Missing authentication information' });
  }

  const usersService = container.resolve(UsersService);
  const user = await usersService.getUser(auth.uid);

  if (!user) {
    return res.status(401).json({ error: 'User not found in the database' });
  }

  req.user = user;
  next();
}

/*
 * Checks that user is linked to a Role in the database (should use userMiddleware first)
 */
export const roleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Missing user information' });
  }

  const usersService = container.resolve(UsersService);
  const role = await usersService.getUserRole(user);

  if (!role) {
    return res.status(401).json({ error: 'User role not found in the database' });
  }

  req.role = role;
  next();
}

/*
 * General purpose auth middleware. Gives the endpoint 'req: Request' the following fields:
 * - req.auth
 * - req.user
 * - req.role
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await firebaseAuthMiddleware(req, res, async () => {
      await userMiddleware(req, res, async () => {
        await roleMiddleware(req, res, next);
      });
    });
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
