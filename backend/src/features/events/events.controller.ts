import { Request, Response, NextFunction } from 'express';
import { EventsService, EventRequestsService } from './event.service';
import { NewEvent, NewEventRequest } from './events.model';
import { container } from 'tsyringe';

export class EventsController {
  private eventsService = container.resolve(EventsService);
  private eventRequestsService = container.resolve(EventRequestsService);

  /**
   * Create a new event
   * @route POST /api/events
   * @access Public (Adjust as needed)
   */
  public createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventData: NewEvent = req.body; // Type ensures request body conforms to NewEvent schema
      const insertedEvent = await this.eventsService.createEvent(eventData);
      if (insertedEvent === undefined) {
        res.status(400).json({ message: 'Failed to create event' });
      } else {
        res.status(201).json(insertedEvent);
      }
    } catch (error) {
      next(error); // Pass error to global error handler middleware
    }
  };

  /**
   * Get all events
   * @route GET /api/events
   * @access Public (Adjust as needed)
   */
  public getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = await this.eventsService.getAllEvents();
      res.json(events); // Respond with the array of events
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific event by ID
   * @route GET /api/events/:id
   * @access Public (Adjust as needed)
   */
  public getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = parseInt(req.params.id, 10); // Convert ID parameter to an integer
      const event = await this.eventsService.getEventById(eventId);

      if (!event) {
        res.status(404).json({ message: 'Event not found' });
      } else {
        res.json(event); // Respond with the event details
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete an event by ID
   * @route DELETE /api/events/:id
   * @access Public (Adjust as needed)
   */
  public deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const eventId = parseInt(req.params.id, 10); // Convert ID parameter to an integer

      // Delete associated shifts first
      await this.eventsService.deleteShiftsByEventId(Number(id));
      await this.eventsService.deleteEvent(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update an existing event
   */
  public updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = parseInt(req.params.id, 10); // Extract and parse the event ID from the request parameters
      const eventData = req.body; // The updated event data
      
      await this.eventsService.updateEvent(eventId, eventData);
      res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createEventRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventData: NewEventRequest = req.body;
      const eventId = await this.eventRequestsService.createEventRequest(eventData);
      res.status(201).json({ message: 'Event request created', eventId });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all event requests
   * @route GET /api/event-requests
   * @access Public (Adjust as needed)
   */
  public getAllEventRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventRequests = await this.eventRequestsService.getAllEventRequests();
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
      const eventId = parseInt(req.params.id, 10);
      const eventRequest = await this.eventRequestsService.getEventRequestById(eventId);

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
      const eventId = parseInt(req.params.id, 10);
      await this.eventRequestsService.deleteEventRequest(eventId);
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
      const eventId = parseInt(req.params.id, 10);
      const eventData = req.body;
      await this.eventRequestsService.updateEventRequest(eventId, eventData);
      res.status(200).json({ message: 'Event request updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  public getRequesterFullName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requesterId = parseInt(req.params.id, 10);
      const requesterName = await this.eventRequestsService.getRequesterFullName(requesterId);
      res.json(requesterName);
    } catch (error) {
      next(error);
    }
  }

}
