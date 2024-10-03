import { App } from '@/app';
import { migrateToLatest } from '@database/database';

async function startServer() {
  await migrateToLatest();
  const app = new App([]);
  app.listen();
}

startServer();
