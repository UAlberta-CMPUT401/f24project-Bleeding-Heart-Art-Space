import { UsersService } from "@/features/users/users.service";
import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { container } from "tsyringe";

/*
 * Checks the user is signed in to firebase
 */
export const firebaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    res.status(401).json({ error: 'No auth header token provided' });
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.auth = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}

/*
 * Checks that user is linked to a User in the database (should use firebaseAuthMiddleware first)
 */
export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.auth;
  if (auth === undefined) {
    res.status(401).json({ error: 'Missing auth' });
    return;
  }

  const usersService = container.resolve(UsersService);
  const user = await usersService.getUser(auth.uid);
  if (user === undefined) {
    res.status(401).json({ error: 'Missing user' });
    return;
  }
  req.user = user;
  next();
}

/*
 * Checks that user is linked to a Role in the database (should user userMiddleware first)
 */
export const roleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ error: 'Missing user' });
    return;
  }

  const usersService = container.resolve(UsersService);
  const role = await usersService.getUserRole(user);
  if (role === undefined) {
    res.status(401).json({ error: 'Missing role' });
    return;
  }
  req.role = role;
  next();
}

/*
 * General purpose auth middleware. Gives the endpoint Request type the fields
 * - req.auth
 * - req.user
 * - req.role
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  firebaseAuthMiddleware(req, res, () => {
    userMiddleware(req, res, () => {
      roleMiddleware(req, res, next);
    });
  });
}
