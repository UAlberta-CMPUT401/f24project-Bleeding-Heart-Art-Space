import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create the 'events' table with additional fields

  // Drop the 'volunteer_shifts' table if it exists
  await db.schema.dropTable('volunteer_shifts').ifExists().execute();

  await db.schema
    .createTable('volunteer_shifts')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('event_id', 'integer', col => col.notNull())
    .addColumn('volunteer_role', 'integer', col => col.notNull())
    .addColumn('start', 'timestamp', col => col.notNull())
    .addColumn('end', 'timestamp', col => col.notNull())
    .addForeignKeyConstraint('fk_event_id', ['event_id'], 'events', ['id']) // Foreign key constraint
    .addForeignKeyConstraint('fk_volunteer_role', ['volunteer_role'], 'volunteer_roles', ['id']) // Foreign key constraint
    .execute();

}

export async function down(db: Kysely<any>): Promise<void> {

    await db.schema.dropTable('volunteer_shifts').execute();

}
  