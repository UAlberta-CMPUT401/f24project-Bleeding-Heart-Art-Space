import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create the 'events' table with additional fields
  await db.schema
    .createTable('event_requests')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'varchar(255)', col => col.notNull())       // Add title column
    .addColumn('start', 'timestamp', col => col.notNull())
    .addColumn('end', 'timestamp', col => col.notNull())
    .addColumn('venue', 'varchar(255)', col => col.notNull())       // Venue column
    .addColumn('address', 'varchar(255)', col => col.notNull())     // Address column
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    // Drop the tables in reverse order to avoid foreign key constraint issues
    await db.schema.dropTable('event_requests').execute();
}

