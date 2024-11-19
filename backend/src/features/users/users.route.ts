import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { UsersController } from './users.controller';
import { authMiddleware, firebaseAuthMiddleware, isAdminMiddleware, userMiddleware } from '@middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

export class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/is-signed-in`, firebaseAuthMiddleware, this.usersController.getIsAuth);
    this.router.get(`${this.path}/user`, firebaseAuthMiddleware, userMiddleware, this.usersController.getUser);
    this.router.post(`${this.path}/user`, firebaseAuthMiddleware, this.usersController.createVolunteer);
    this.router.get(`${this.path}/role`, authMiddleware, this.usersController.getRole);
    this.router.get(`${this.path}/user-role`, firebaseAuthMiddleware, this.usersController.getUserAndRole);
    this.router.get(this.path, authMiddleware, isAdminMiddleware, this.usersController.getUsersAndRole);
    this.router.post(`${this.path}/batch-assign-role`, authMiddleware, isAdminMiddleware, this.usersController.batchAssignRole);
    this.router.get(`${this.path}/roles`, authMiddleware, this.usersController.getRoles);
    this.router.post(`${this.path}/update-user`, authMiddleware, this.usersController.updateUser);
  }
}
