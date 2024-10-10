import { App } from '@/app';
import { migrateToLatest } from '@database/database';
import { UsersRoute } from '@features/users/users.route';
import { VolunteerRolesRoute } from '@features/volunteerRoles/volunteerRoles.route';

async function startServer() {
  // Run database migrations
  await migrateToLatest();

  // Initialize all routes in a single App instance
  const app = new App([new UsersRoute(), new VolunteerRolesRoute()]);

  // Start the server
  app.listen();
}

startServer();
