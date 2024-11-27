import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { EventsController } from './events.controller';
import { authMiddleware, isAdminMiddleware } from '@/common/middlewares/auth.middleware';

export class EventsRoute implements Routes {
  public path = '/events';
  public router = Router();
  public eventsController = new EventsController();
  

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Route to create an event
    this.router.post(`${this.path}`, authMiddleware, isAdminMiddleware, this.eventsController.createEvent);

    // Route to get all events
    this.router.get(`${this.path}`, authMiddleware, this.eventsController.getAllEvents);

    // Route to get upcoming events
    this.router.get(`${this.path}/upcoming`, authMiddleware, this.eventsController.getUpcomingEvents);

    // Route to get a specific event by ID
    this.router.get(`${this.path}/:id`, authMiddleware, this.eventsController.getEventById);

    // Route to delete an event by ID
    this.router.delete(`${this.path}/:id`, authMiddleware, this.eventsController.deleteEvent);

    // Route to update an event by ID
    this.router.put(`${this.path}/:id`, authMiddleware, this.eventsController.updateEvent);
  }
}
