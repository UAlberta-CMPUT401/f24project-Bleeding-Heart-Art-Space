import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { VolunteerRolesController } from './volunteerRoles.controller';
import { authMiddleware, firebaseAuthMiddleware, userMiddleware } from '@middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

export class VolunteerRolesRoute implements Routes {
  public path = '/users';
  public router = Router();
  public volunteerRolesController = new VolunteerRolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Add logging to confirm route initialization
    console.log(`Initializing volunteer roles route at: ${this.path}`);
    
    // Define routes without authMiddleware temporarily for debugging
    this.router.get(this.path, this.volunteerRolesController.getAllVolunteerRoles);
    this.router.post(this.path, this.volunteerRolesController.createVolunteerRole);
    this.router.delete(`${this.path}/:id`, this.volunteerRolesController.deleteVolunteerRole);
  }
}