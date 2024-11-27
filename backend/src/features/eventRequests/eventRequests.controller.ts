import { container } from 'tsyringe';
import { EventRequestsService } from './eventRequests.service';
import { isAuthenticated } from '@/common/utils/auth';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/common/utils/logger';

export class EventRequestsController {
  private eventRequestsService = container.resolve(EventRequestsService);

  public createEventRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isAuthenticated(req)) {
        res.status(401);
        return;
      }
      const eventData = req.body;
      const insertedEvent = await this.eventRequestsService.createEventRequest(req.auth.uid, eventData);
      if (insertedEvent === undefined) {
        res.status(400)
        return;
      }
      res.status(201).json(insertedEvent);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all event requests
   * @route GET /api/event-requests
   * @access Public (Adjust as needed)
   */
  public getPendingEventRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventRequests = await this.eventRequestsService.getPendingEventRequests();
      res.json(eventRequests);
    } catch (error) {
      next(error);
    }
  }

  public getUserEventRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isAuthenticated(req)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const eventRequests = await this.eventRequestsService.getUserEventRequests(req.auth.uid);
      res.json(eventRequests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific event request by ID
   * @route GET /api/event-requests/:id
   * @access Public (Adjust as needed)
   */
  public getEventRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventRequestId = parseInt(req.params.id, 10);
      const eventRequest = await this.eventRequestsService.getEventRequestById(eventRequestId);

      if (!eventRequest) {
        res.status(404).json({ message: 'Event request not found' });
      } else {
        res.json(eventRequest);
      }
    } catch (error) {
      next(error);
    }

  }

  /**
   * Delete an event request by ID
   * @route DELETE /api/event-requests/:id
   * @access Public (Adjust as needed)
   */
  public deleteEventRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventRequestId = parseInt(req.params.id, 10);
      await this.eventRequestsService.deleteEventRequest(eventRequestId);
      res.status(200).json({ message: 'Event request deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing event request
   * @route PUT /api/event-requests/:id
   * @access Public (Adjust as needed)
   */
  public updateEventRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventRequestId = parseInt(req.params.id, 10);
      const eventData = req.body;
      await this.eventRequestsService.updateEventRequest(eventRequestId, eventData);
      res.status(200).json({ message: 'Event request updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  public confirmEventRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventRequestId = parseInt(req.params.id, 10);
      const confirmedEvent = await this.eventRequestsService.confirmEventRequest(eventRequestId);
      if (confirmedEvent === undefined) {
        res.status(400).json({ error: 'failed to confirm event' });
        return;
      }
      res.status(200).json(confirmedEvent);
    } catch (error) {
      next(error);
    }
  }
}
