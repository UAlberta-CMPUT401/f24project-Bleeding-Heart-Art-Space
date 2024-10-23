import { App } from '@/app';
import { migrateToLatest } from '@database/database';
import { UsersRoute } from '@features/users/users.route';
import { VolunteerRolesRoute } from '@features/volunteerRoles/volunteerRoles.route';
import { EventsRoute } from './features/events/events.route';
import { VolunteerShiftsRoute } from '@features/volunteerShifts/volunteerShifts.route';
import 'reflect-metadata';


async function startServer() {
  // Run database migrations
  await migrateToLatest();

  // Initialize all routes in a single App instance
  const app = new App([new UsersRoute(), new VolunteerRolesRoute(), new EventsRoute(), new VolunteerShiftsRoute()]);

  // Start the server
  app.listen();
}

startServer();
