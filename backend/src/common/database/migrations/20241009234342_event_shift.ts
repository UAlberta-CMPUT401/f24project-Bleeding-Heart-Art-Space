import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create the 'events' table with additional fields
  await db.schema
    .createTable('events')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'varchar(255)', col => col.notNull())       // Add title column
    .addColumn('start', 'timestamp', col => col.notNull())
    .addColumn('end', 'timestamp', col => col.notNull())
    .addColumn('venue', 'varchar(255)', col => col.notNull())       // Venue column
    .addColumn('address', 'varchar(255)', col => col.notNull())     // Address column
    .execute();


  // // Create the 'shifts' table
  // await db.schema
  //   .createTable('shifts')
  //   .addColumn('id', 'serial', col => col.primaryKey())
  //   .addColumn('event_id', 'integer', col =>
  //     col.notNull().references('events.id').onDelete('cascade')
  //   )
  //   .addColumn('user_id', 'integer', col =>
  //     col.notNull().references('users.id').onDelete('set null')  // Reference to existing 'users' table
  //   )
  //   .addColumn('start', 'timestamp', col => col.notNull())
  //   .addColumn('end', 'timestamp', col => col.notNull())
  //   .execute();

  // // Create the 'event_artists' table as a join table between 'events' and 'users'
  // await db.schema
  //   .createTable('event_artists')
  //   .addColumn('id', 'serial', col => col.primaryKey())
  //   .addColumn('event_id', 'integer', col =>
  //     col.notNull().references('events.id').onDelete('cascade')
  //   )
  //   .addColumn('user_id', 'integer', col =>
  //     col.notNull().references('users.id').onDelete('cascade') // Reference to existing 'users' table
  //   )
  //   .execute();

  // Optional: Create indexes for optimization
  await db.schema.createIndex('event_start_end_index').on('events').columns(['start', 'end']).execute();
  await db.schema.createIndex('shift_event_user_index').on('shifts').columns(['event_id', 'user_id']).execute();
  await db.schema.createIndex('event_artist_event_user_index').on('event_artists').columns(['event_id', 'user_id']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the tables in reverse order to avoid foreign key constraint issues
  await db.schema.dropTable('event_artists').execute();
  await db.schema.dropTable('shifts').execute();
  await db.schema.dropTable('events').execute();
}
