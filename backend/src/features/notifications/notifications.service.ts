import { singleton } from 'tsyringe';
import { DeleteResult, UpdateResult } from 'kysely';
import { db } from '@database/database';
import { Notification, NewNotification } from './notifications.model';

@singleton()
export class NotificationsService {
  
  public async getAllNotifications(): Promise<Notification[]> {
    return db
      .selectFrom('notifications')
      .selectAll()
      .execute();
  }

  public async getNotificationsByRole(roleName: string): Promise<Notification[]> {
    return db
      .selectFrom('notifications')
      .selectAll()
      .where('role_name', '=', roleName)
      .execute();
  }

  public async createNotification(notificationData: NewNotification): Promise<Notification | undefined> {
    return db
      .insertInto('notifications')
      .values(notificationData)
      .returningAll()
      .executeTakeFirst();
  }

  public async deleteNotification(id: number): Promise<DeleteResult> {
    return db
      .deleteFrom('notifications')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async markNotificationAsRead(id: number): Promise<UpdateResult> {
    return db
      .updateTable('notifications')
      .set({ is_read: true })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async markAllNotificationsAsRead(): Promise<UpdateResult[]> {
    return db
      .updateTable('notifications')
      .set({ is_read: true })
      .execute();
  }
}
