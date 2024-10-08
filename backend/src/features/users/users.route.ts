import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { UsersController } from './users.controller';
import { authMiddleware, firebaseAuthMiddleware, userMiddleware } from '@middlewares/auth.middleware';

export class UsersRoute implements Routes {
  public path = 'users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/is-signed-in`, firebaseAuthMiddleware, this.usersController.getIsAuth);
    this.router.get(`${this.path}/user`, firebaseAuthMiddleware, userMiddleware, this.usersController.getUser);
    this.router.post(`${this.path}/user`, firebaseAuthMiddleware, this.usersController.createVolunteer)
    this.router.get(`${this.path}/role`, authMiddleware, this.usersController.getRole);
  }
}
