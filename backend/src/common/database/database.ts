import { singleton } from "tsyringe";
import * as pg from 'pg'
import { Pool, PoolConfig } from 'pg'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import { DB_NAME, DB_HOST, DB_USER, DB_PORT, DB_PASSWORD } from "@config/env";
import { promises as fs } from 'fs'
import * as path from 'path'
import { logger } from "@utils/logger";
import { RolesTable, UsersTable } from "@features/users/users.model";
import { VolunteerRolesTable } from "@/features/volunteerRoles/volunteerRoles.model";
import { EventsTable } from "@/features/events/events.model";
import { VolunteerShiftsTable } from "@/features/volunteerShifts/volunteerShifts.model";
import { ShiftSignupTable } from "@/features/shiftSignup/shiftSignup.model";
import { EventRequestsTable } from "@/features/eventRequests/eventRequests.model";

export interface Database {
  users: UsersTable
  roles: RolesTable
  volunteer_roles: VolunteerRolesTable
  events: EventsTable
  volunteer_shifts: VolunteerShiftsTable
  shift_signup: ShiftSignupTable
  event_requests: EventRequestsTable
}

// make sure that postgres 'numeric' types are numbers, not strings
// see: https://kysely.dev/docs/recipes/data-types#configuring-runtime-javascript-types
const numericTypeID = 1700;
pg.types.setTypeParser(numericTypeID, (val) => {
  return parseFloat(val);
});




const poolConfig: PoolConfig = {
  database: DB_NAME,
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  password: DB_PASSWORD,
  max: 10,
}

export async function migrateToLatest() {
  const dialect = new PostgresDialect({
    pool: new Pool(poolConfig)
  });

  const db = new Kysely<Database>({
    dialect,
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      logger.info(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      logger.error(`failed to execute migration "${it.migrationName}"`);
    }
  })

  if (error) {
    logger.error('failed to migrate');
    logger.error(error);
    process.exit(1);
  }

  await db.destroy();
}

const dialect = new PostgresDialect({
  pool: new Pool(poolConfig)
});

export const db = new Kysely<Database>({
  dialect,
});
