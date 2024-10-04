import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { UsersController } from './users.controller';
import { firebaseAuthMiddleware } from '@middlewares/auth.middleware';

export class UsersRoute implements Routes {
  public path = 'users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/is-signed-in`, firebaseAuthMiddleware, this.usersController.getIsAuth);
  }
}
