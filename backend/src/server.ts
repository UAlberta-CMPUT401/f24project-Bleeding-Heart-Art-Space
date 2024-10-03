import { App } from '@/app';
import { migrateToLatest } from '@database/database';
import { UsersRoute } from '@features/users/users.route';

async function startServer() {
  await migrateToLatest();
  const app = new App([new UsersRoute]);
  app.listen();
}

startServer();
