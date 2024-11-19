import { Request, Response, NextFunction } from 'express';
import { EventsService } from './event.service';
import { NewEvent } from './events.model';
import { container } from 'tsyringe';
import { isWithinInterval, addWeeks, startOfToday } from 'date-fns';

export class EventsController {
  private eventsService = container.resolve(EventsService);

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

  public getUpcomingEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get the current date and calculate the two-week interval
      const currentDate = startOfToday(); // Get today's date at midnight
      const twoWeeksFromNow = addWeeks(currentDate, 2); // Date two weeks from now

      // Fetch all events
      const events = await this.eventsService.getAllEvents();

      // Filter events that start within the next two weeks
      const upcomingEvents = events.filter(event => {
        const eventStartDate = new Date(event.start);
        return isWithinInterval(eventStartDate, { start: currentDate, end: twoWeeksFromNow });
      });

      res.json(upcomingEvents); // Respond with the upcoming events
    } catch (error) {
      next(error); // Pass error to global error handler middleware
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
}
