import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('notifications')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('role_name', 'varchar(64)', (col) => 
      col.notNull().references('volunteer_roles.name').onDelete('cascade'))
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('message', 'text', (col) => col.notNull())
    .addColumn('is_read', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();
}



export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('notifications').execute();
}
