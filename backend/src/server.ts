import { App } from '@/app';
import { migrateToLatest } from '@database/database';
import { UsersRoute } from '@features/users/users.route';
import { VolunteerRolesRoute } from '@features/volunteerRoles/volunteerRoles.route';
import { EventsRoute } from './features/events/events.route';
import { VolunteerShiftsRoute } from '@features/volunteerShifts/volunteerShifts.route';
import { ShiftSignupRoute } from './features/shiftSignup/shiftSignup.route';
import 'reflect-metadata';
import { EventRequestsRoute } from './features/eventRequests/eventRequests.route';
import { NotificationsRoute } from './features/notifications/notifications.route';
import { SendEmailsRoute } from './features/sendEmails/sendEmails.route';


async function startServer() {
  // Run database migrations
  await migrateToLatest();

  // Initialize all routes in a single App instance
  const app = new App([
    new UsersRoute(), 
    new VolunteerRolesRoute(), 
    new EventsRoute(), 
    new VolunteerShiftsRoute(), 
    new ShiftSignupRoute(),
    new EventRequestsRoute(),
    new NotificationsRoute(),
    new SendEmailsRoute(),
  ]);

  // Start the server
  app.listen();
}

startServer();
