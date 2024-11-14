import {
    Generated,
    ColumnType,
    Insertable,
    Selectable,
    Updateable,
  } from 'kysely'
  

export interface NotificationsTable {
  id: Generated<number>;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export type Notification = Selectable<NotificationsTable>
export type NewNotification = Insertable<NotificationsTable>
export type NotificationUpdate = Updateable<NotificationsTable>

