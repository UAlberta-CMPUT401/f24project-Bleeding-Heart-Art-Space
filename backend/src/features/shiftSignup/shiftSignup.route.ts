import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ShiftSignupController } from './shiftSignup.controller';

export class ShiftSignupRoute implements Routes {
  public path = '/shift-signups';
  public router = Router();
  public shiftSignupController = new ShiftSignupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Route to create a new shift signup
    this.router.post(`${this.path}`, this.shiftSignupController.create);

    // Route to get all shift signups
    this.router.get(`${this.path}`, this.shiftSignupController.getAll);

    // Route to get a specific shift signup by ID
    this.router.get(`${this.path}/:id`, this.shiftSignupController.getById);

    // Route to delete a shift signup by ID
    this.router.delete(`${this.path}/:id`, this.shiftSignupController.delete);

    // Route to update a shift signup by ID
    this.router.put(`${this.path}/:id`, this.shiftSignupController.update);
  }
}
