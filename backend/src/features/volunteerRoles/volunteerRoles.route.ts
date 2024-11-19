import { Router, Request, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { VolunteerRolesController } from './volunteerRoles.controller';
import { authMiddleware, isAdminMiddleware } from '@middlewares/auth.middleware';

export class VolunteerRolesRoute implements Routes {
  public path = '/volunteer_roles';
  public router = Router();
  private volunteerRolesController = new VolunteerRolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path, 
      authMiddleware,
      this.asyncHandler(this.volunteerRolesController.getAllVolunteerRoles)
    );

    this.router.post(
      this.path,
      authMiddleware,
      isAdminMiddleware,
      this.asyncHandler(this.volunteerRolesController.createVolunteerRole)
    );

    this.router.post(
      `${this.path}/batch_delete`,
      authMiddleware,
      isAdminMiddleware,
      this.asyncHandler(this.volunteerRolesController.deleteVolunteerRoles)
    );

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      isAdminMiddleware,
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
