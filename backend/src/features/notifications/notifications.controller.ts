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
    
    const {title, message, role_name} = req.body;
    if (!title || !message || !role_name) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    try {
      const notification = await this.notificationsService.createNotification({ title, message, role_name, is_read: false });
      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).send({ message: 'Failed to create notification' });
    }
  };

  public getNotificationsByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roleName } = req.params;
      const notifications = await this.notificationsService.getNotificationsByRole(roleName);
      res.status(200).json({ data: notifications, message: `Notifications for role ${roleName} retrieved successfully` });
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
