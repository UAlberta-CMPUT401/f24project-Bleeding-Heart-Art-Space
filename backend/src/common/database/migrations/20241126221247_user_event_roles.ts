import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {

  // Used to give permissions to users for a specific event (giving artist admin access for an event)
  await db.schema
    .createTable('user_event_roles')
    .addColumn('user_id', 'integer', (col) => col
      .references('users.id').onDelete('cascade')
      .notNull()
    )
    .addColumn('event_id', 'integer', (col) => col
      .references('events.id').onDelete('cascade')
      .notNull()
    )
    .addColumn('role_id', 'integer', (col) => col
      .references('roles.id').onDelete('cascade')
      .notNull()
    )
    .addPrimaryKeyConstraint('user_event_roles_pkey', ['user_id', 'event_id', 'role_id'])
    .execute();

}

export async function down(db: Kysely<any>): Promise<void> {

  await db.schema.dropTable('user_event_roles').execute();

}
