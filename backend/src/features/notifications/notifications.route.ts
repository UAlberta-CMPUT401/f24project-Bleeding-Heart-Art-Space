import { Router, Request, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { NotificationsController } from './notifications.controller';
import { authMiddleware, isAdminMiddleware } from '@middlewares/auth.middleware';

export class NotificationsRoute implements Routes {
  public path = '/notifications';
  public router = Router();
  private notificationsController = new NotificationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      authMiddleware,
      this.asyncHandler(this.notificationsController.getAllNotifications)
    );

    this.router.post(
      this.path,
      authMiddleware,
      this.asyncHandler(this.notificationsController.createNotification)
    );

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      isAdminMiddleware,
      this.asyncHandler(this.notificationsController.deleteNotification)
    );

    this.router.patch(
      `${this.path}/:id/read`,
      authMiddleware,
      this.asyncHandler(this.notificationsController.markNotificationAsRead)
    );

    this.router.patch(
      `${this.path}/read`,
      authMiddleware,
      this.asyncHandler(this.notificationsController.markAllNotificationsAsRead)
    );
  }

  /**
   * Helper function to handle async controller methods and catch errors.
   * @param fn - Controller function to wrap with error handling.
   */
  private asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
