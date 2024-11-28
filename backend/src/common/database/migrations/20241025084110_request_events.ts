import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create the 'events' table with additional fields
  await db.schema
    .createTable('event_requests')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'varchar(255)', col => col.notNull())       // Add title column
    .addColumn('start', 'timestamptz', col => col.notNull())
    .addColumn('end', 'timestamptz', col => col.notNull())
    .addColumn('venue', 'varchar(255)', col => col.notNull())       // Venue column
    .addColumn('address', 'varchar(255)', col => col.notNull())     // Address column
    .addColumn('requester_id', 'integer', col => col
      .notNull()
      .references('users.id')
      .onDelete('cascade'))
    .addColumn('status', 'integer', col => col.notNull()) // 0 denied, 1 approved, 2 pending
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    // Drop the tables in reverse order to avoid foreign key constraint issues
    await db.schema.dropTable('event_requests').execute();
}

