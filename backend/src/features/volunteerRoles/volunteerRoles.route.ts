import { Router, Request, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { VolunteerRolesController } from './volunteerRoles.controller';
import { authMiddleware, firebaseAuthMiddleware, userMiddleware } from '@middlewares/auth.middleware';

export class VolunteerRolesRoute implements Routes {
  public path = '/volunteer_roles';
  public router = Router();
  private volunteerRolesController = new VolunteerRolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Log route initialization for debugging
    console.log(`Initializing volunteer roles route at: ${this.path}`);

    // Define routes with middleware
    // Uncomment the middleware when ready for production or after debugging
    this.router.get(
      this.path, 
      // firebaseAuthMiddleware, // Uncomment this to enable Firebase authentication
      this.asyncHandler(this.volunteerRolesController.getAllVolunteerRoles)
    );

    this.router.post(
      this.path,
    //   authMiddleware, // Uncomment this to enable generic auth middleware
    //   userMiddleware, // Uncomment this to enable user-specific middleware
      this.asyncHandler(this.volunteerRolesController.createVolunteerRole)
    );

    this.router.delete(
      `${this.path}/:id`,
      // authMiddleware, // Uncomment for authorization
      this.asyncHandler(this.volunteerRolesController.deleteVolunteerRole)
    );
  }

  /**
   * Helper function to handle async controller methods and catch errors.
   * @param fn - Controller function to wrap with error handling.
   */
  private asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
