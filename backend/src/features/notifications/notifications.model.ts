import {
  Generated,
  ColumnType,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface NotificationsTable {
id: Generated<number>;                // Auto-generated primary key
role_name: string;                    // Name of the role, referenced in other tables
title: string;                        // Title of the notification
message: string;                      // Message body of the notification
is_read: boolean;                     // Whether the notification has been read
created_at: ColumnType<Date, Date | undefined, never>; // Timestamp, default to current time on insertion
}

// Type for selecting data (i.e., fetching notifications)
export type Notification = Selectable<NotificationsTable>;

// Type for inserting new notifications
export type NewNotification = Insertable<NotificationsTable>;

// Type for updating notifications (allows partial updates)
export type NotificationUpdate = Updateable<NotificationsTable>;
