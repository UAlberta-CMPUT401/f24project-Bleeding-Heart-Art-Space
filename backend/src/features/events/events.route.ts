import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { EventsController } from './events.controller';

export class EventsRoute implements Routes {
  public path = '/events';
  public router = Router();
  public eventsController = new EventsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Route to create an event
    this.router.post(`${this.path}`, this.eventsController.createEvent);

    // Route to get all events
    this.router.get(`${this.path}`, this.eventsController.getAllEvents);

    // Route to get a specific event by ID
    this.router.get(`${this.path}/:id`, this.eventsController.getEventById);

    // Route to delete an event by ID
    this.router.delete(`${this.path}/:id`, this.eventsController.deleteEvent);

    // Route to update an event by ID
    this.router.put(`${this.path}/:id`, this.eventsController.updateEvent);
  }
}
