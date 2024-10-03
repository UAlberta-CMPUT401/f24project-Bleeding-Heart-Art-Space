import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('roles')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(64)', (col) => col.notNull().unique())
    .execute(); // TODO: add permission bool fields and predefine roles with set permissions
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
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('roles').execute();
}
