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

  public async createNotification(newNotification: NewNotification): Promise<Notification | undefined> {
    const insertedNotification = await db
      .insertInto('notifications')
      .values(newNotification)
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
