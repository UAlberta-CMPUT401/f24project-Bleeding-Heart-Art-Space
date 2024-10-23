import { Router, Request, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { VolunteerShiftsController } from './volunteerShifts.controller';
import { authMiddleware, firebaseAuthMiddleware, userMiddleware } from '@middlewares/auth.middleware';

export class VolunteerShiftsRoute implements Routes {
  public path = '/volunteer_shifts';
  public router = Router();
  private volunteerShiftsController = new VolunteerShiftsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Define routes with middleware
    // Uncomment the middleware when ready for production or after debugging

    // Get all shifts for a specific event
    this.router.get(
      '/events/:eventId' + this.path,
      // firebaseAuthMiddleware, // Uncomment this to enable Firebase authentication
      this.asyncHandler(this.volunteerShiftsController.getShiftsByEvent)
    );

    // Create new shifts for a specific event
    this.router.post(
      '/events/:eventId' + this.path,
      // authMiddleware, // Uncomment this to enable generic auth middleware
      // userMiddleware, // Uncomment this to enable user-specific middleware
      this.asyncHandler(this.volunteerShiftsController.createShifts)
    );

    // Delete a specific shift by ID
    this.router.delete(
      `${this.path}/:id`,
      // authMiddleware, // Uncomment for authorization
      this.asyncHandler(this.volunteerShiftsController.deleteShift)
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
