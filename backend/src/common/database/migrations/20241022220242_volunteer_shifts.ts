import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Drop the 'volunteer_shifts' table if it exists
  await db.schema.dropTable('volunteer_shifts').ifExists().execute();

  // Create 'volunteer_shifts' table with volunteer_role referencing the 'name' from volunteer_roles
  await db.schema
    .createTable('volunteer_shifts')
    .addColumn('id', 'serial', (col) => col.primaryKey()) // Primary key
    .addColumn('event_id', 'integer', (col) =>
      col
        .notNull()
        .references('events.id')
        .onDelete('cascade')
    ) // Foreign key to 'events' table
    .addColumn('volunteer_role', 'varchar(64)', (col) =>
      col
        .notNull()
        .references('volunteer_roles.name')
        .onDelete('cascade')
    ) // Foreign key to 'volunteer_roles.name'
    .addColumn('start', 'timestamp', (col) => col.notNull()) // Start time of the shift
    .addColumn('end', 'timestamp', (col) => col.notNull()) // End time of the shift
    .execute();

  // Optionally, create an index on volunteer_role for performance
  await db.schema
    .createIndex('volunteer_shifts_role_index')
    .on('volunteer_shifts')
    .columns(['volunteer_role'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the 'volunteer_shifts' table if it exists
  await db.schema.dropTable('volunteer_shifts').ifExists().execute();
}
