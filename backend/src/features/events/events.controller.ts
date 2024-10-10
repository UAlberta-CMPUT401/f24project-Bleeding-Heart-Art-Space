import { Request, Response, NextFunction } from 'express';
import { EventsService } from './event.service';
import { NewEvent } from './events.model';

export class EventsController {
  private eventsService = new EventsService();

  /**
   * Create a new event
   * @route POST /api/events
   * @access Public (Adjust as needed)
   */
  public createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventData: NewEvent = req.body; // Type ensures request body conforms to NewEvent schema
      const eventId = await this.eventsService.createEvent(eventData);
      res.status(201).json({ message: 'Event created', eventId });
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
      const eventId = parseInt(req.params.id, 10); // Convert ID parameter to an integer
      await this.eventsService.deleteEvent(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
