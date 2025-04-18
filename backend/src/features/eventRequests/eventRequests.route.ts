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
    this.router.get(`${this.path}`, authMiddleware, isAdminMiddleware, this.eventsController.getPendingEventRequests);
    this.router.get(`${this.path}/:id`, authMiddleware, isAdminMiddleware, this.eventsController.getEventRequestById);
    this.router.get(`${this.path}_user`, authMiddleware, this.eventsController.getUserEventRequests);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.eventsController.deleteEventRequest);
    this.router.put(`${this.path}/:id`, authMiddleware, this.eventsController.updateEventRequest);
    this.router.post(`${this.path}/:id/confirm`, authMiddleware, isAdminMiddleware, this.eventsController.confirmEventRequest);
    this.router.post(`${this.path}/:id/deny`, authMiddleware, isAdminMiddleware, this.eventsController.denyEventRequest);
  }
}
