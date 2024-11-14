import { singleton } from 'tsyringe';
import { DeleteResult, UpdateResult } from 'kysely';
import { db } from '@database/database';
import { Notification, NewNotification } from './notifications.model';

@singleton()
export class NotificationsService {
  
  public async getAllNotifications(): Promise<Notification[]> {
    return await db
      .selectFrom('notifications')
      .selectAll()
      .execute();
  }

  public async createNotification(notificationData: NewNotification): Promise<Notification | undefined> {
    const insertedNotification = await db
      .insertInto('notifications')
      .values({
        user_id: notificationData.user_id,
        title: notificationData.title,
        message: notificationData.message,
        is_read: notificationData.is_read,
        created_at: notificationData.created_at,
      })
      .returningAll()
      .executeTakeFirst();

    return insertedNotification;
  }

  public async deleteNotification(id: number): Promise<DeleteResult> {
    return await db
      .deleteFrom('notifications')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async markNotificationAsRead(id: number): Promise<UpdateResult> {
    return await db
      .updateTable('notifications')
      .set({ is_read: true })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async markAllNotificationsAsRead(): Promise<UpdateResult[]> {
    return await db
      .updateTable('notifications')
      .set({ is_read: true })
      .execute();
  }
}
