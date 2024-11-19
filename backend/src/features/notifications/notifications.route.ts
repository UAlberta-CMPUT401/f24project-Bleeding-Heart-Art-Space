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
    // Get all notifications
    this.router.get(
      this.path,
      authMiddleware,
      this.asyncHandler(this.notificationsController.getAllNotifications)
    );

    // Create a new notification (Admin only)
    this.router.post(
      this.path,
      authMiddleware,
      isAdminMiddleware,
      this.asyncHandler(this.notificationsController.createNotification)
    );

    // Get notifications by role
    this.router.get(
      `${this.path}/role/:roleName`,
      authMiddleware,
      this.asyncHandler(this.notificationsController.getNotificationsByRole)
    );

    // Delete a notification by ID (Admin only)
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      isAdminMiddleware,
      this.asyncHandler(this.notificationsController.deleteNotification)
    );

    // Mark a specific notification as read
    this.router.patch(
      `${this.path}/:id/read`,
      authMiddleware,
      this.asyncHandler(this.notificationsController.markNotificationAsRead)
    );

    // Mark all notifications as read
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
    fn: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | void>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
