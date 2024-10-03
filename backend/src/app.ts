import 'reflect-metadata';
import express from 'express';
import { Routes } from '@interfaces/routes.interface';
import { NODE_ENV, PORT } from '@config/env';
import { logger } from '@utils/logger';
import { loggerMiddleware } from '@middlewares/logger.middleware';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.debug(`Server is running at http://localhost:${PORT}`)
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(loggerMiddleware);
    this.app.use(express.json());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }
}
