import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { NotificationsService } from './notifications.service';
import { NewNotification } from './notifications.model';

export class NotificationsController {
  public notificationsService = container.resolve(NotificationsService);

  public getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.notificationsService.getAllNotifications();
      res.status(200).json({ data: notifications, message: 'Notifications retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newNotification: NewNotification = req.body;
      const insertedNotification = await this.notificationsService.createNotification(newNotification);
      if (insertedNotification === undefined) {
        res.status(400).json({ message: 'Failed to create notification' });
      } else {
        res.status(201).json(insertedNotification);
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const deletedNotification = await this.notificationsService.deleteNotification(id);
      res.status(200).json({ data: deletedNotification, message: 'Notification deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updatedNotification = await this.notificationsService.markNotificationAsRead(id);
      res.status(200).json({ data: updatedNotification, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  };

  public markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedNotifications = await this.notificationsService.markAllNotificationsAsRead();
      res.status(200).json({ data: updatedNotifications, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  };
}
