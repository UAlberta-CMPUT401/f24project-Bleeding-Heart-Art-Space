import { Router } from "express";
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware, isAdminMiddleware } from "@/common/middlewares/auth.middleware";
import { EventRequestsController } from "./eventRequests.controller";

export class EventRequestsRoute implements Routes {
  public path = '/event_requests';
  public router = Router();
  public eventsController = new EventRequestsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.eventsController.createEventRequest);
    this.router.get(`${this.path}`, authMiddleware, this.eventsController.getAllEventRequests);
    this.router.get(`${this.path}/:id`, authMiddleware, this.eventsController.getEventRequestById);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.eventsController.deleteEventRequest);
    this.router.put(`${this.path}/:id`, authMiddleware, this.eventsController.updateEventRequest);
    this.router.post(`${this.path}/:id/confirm`, authMiddleware, isAdminMiddleware, this.eventsController.confirmEventRequest);
  }
}
