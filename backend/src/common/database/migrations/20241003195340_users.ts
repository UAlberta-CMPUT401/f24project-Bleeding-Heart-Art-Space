import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {

  await db.schema
    .createTable('roles')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(64)', (col) => col.notNull().unique())
    .addColumn('can_take_shift', 'boolean', (col) => col.notNull())
    .addColumn('can_request_event', 'boolean', (col) => col.notNull())
    .addColumn('is_admin', 'boolean', (col) => col.notNull())
    .addColumn('is_blocked', 'boolean', (col) => col.notNull())
    .execute();
  await db.schema
    .createIndex('roles_title_index')
    .on('roles')
    .columns(['title'])
    .execute();

  await db
    .insertInto('roles')
    .values([
      {
        title: 'blocked',
        can_take_shift: false,
        can_request_event: false,
        is_admin: false,
        is_blocked: true,
      },
      {
        title: 'volunteer',
        can_take_shift: true,
        can_request_event: false,
        is_admin: false,
        is_blocked: false,
      },
      {
        title: 'artist',
        can_take_shift: true,
        can_request_event: true,
        is_admin: false,
        is_blocked: false,
      },
      {
        title: 'admin',
        can_take_shift: true,
        can_request_event: true,
        is_admin: true,
        is_blocked: false,
      },
    ])
    .execute();

  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('uid', 'varchar(256)', (col) => col.notNull().unique())
    .addColumn('first_name', 'varchar(64)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(64)', (col) => col.notNull())
    .addColumn('email', 'varchar(256)', (col) => col.notNull().unique())
    .addColumn('role', 'integer', (col) => col
      .references('roles.id').onDelete('set null')
      .defaultTo(null)
    )
    .execute();
  await db.schema
    .createIndex('users_uid_index')
    .on('users')
    .columns(['uid'])
    .execute();

}

export async function down(db: Kysely<any>): Promise<void> {

  await db.schema.dropTable('users').execute();

  await db.schema.dropTable('roles').execute();

}
