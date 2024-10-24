import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create the shift_signup table
  await db.schema
    .createTable('shift_signup')
    .addColumn('id', 'serial', (col) => col.primaryKey())  // Auto-generated primary key
    .addColumn('user_id', 'integer', (col) => 
      col.references('users.id').onDelete('cascade').notNull())  // Foreign key referencing users table
    .addColumn('shift_id', 'integer', (col) => 
      col.references('volunteer_shifts.id').onDelete('cascade').notNull())  // Foreign key referencing volunteer_shifts table
    .execute();

  // Create index on user_id for better performance when querying by user
  await db.schema
    .createIndex('shift_signup_user_index')
    .on('shift_signup')
    .columns(['user_id'])
    .execute();

  // Create index on shift_id for better performance when querying by shift
  await db.schema
    .createIndex('shift_signup_shift_index')
    .on('shift_signup')
    .columns(['shift_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the shift_signup table
  await db.schema.dropTable('shift_signup').execute();

  // Drop the indexes
  await db.schema.dropIndex('shift_signup_user_index').execute();
  await db.schema.dropIndex('shift_signup_shift_index').execute();
}
