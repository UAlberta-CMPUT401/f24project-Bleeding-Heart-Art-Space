import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ShiftSignupController } from './shiftSignup.controller';
import { authMiddleware } from '@/common/middlewares/auth.middleware';

export class ShiftSignupRoute implements Routes {
  public path = '/shift-signups';
  public router = Router();
  public shiftSignupController = new ShiftSignupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Route to create a new shift signup
    this.router.post(`${this.path}`, authMiddleware, this.shiftSignupController.create);

    // Route to get all shift signups for an event
    this.router.get(`${this.path}`, authMiddleware, this.shiftSignupController.getEventShiftSignups);

    // Route to get shift signups for a specific user
    this.router.get(`${this.path}/user`, authMiddleware, this.shiftSignupController.getUserSignups);

    // Route to get a specific shift signup by ID
    this.router.get(`${this.path}/:id`, this.shiftSignupController.getById);

    // Route to delete a shift signup by ID
    this.router.delete(`${this.path}/:id`, this.shiftSignupController.delete);

    // Route to update a shift signup by ID
    this.router.put(`${this.path}/:id`, this.shiftSignupController.update);

    // Route to check in for a shift
    this.router.post(`${this.path}/:id/checkin`, this.shiftSignupController.checkIn);

    // Route to check out from a shift
    this.router.post(`${this.path}/:id/checkout`, this.shiftSignupController.checkOut);

    // Route to auto-checkout users (e.g., using cron job)
    // this.router.post(`${this.path}/auto-checkout`, this.shiftSignupController.autoCheckOut);

    // New Route to auto-checkout a specific shift signup by ID
    this.router.post(`${this.path}/:id/auto-checkout`, this.shiftSignupController.autoCheckOutById);
  }
}
