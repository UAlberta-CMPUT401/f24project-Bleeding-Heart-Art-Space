import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { UsersController } from './users.controller';

export class UsersRoute implements Routes {
  public path = 'users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
  }
}
