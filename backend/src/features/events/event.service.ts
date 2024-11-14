import { singleton } from 'tsyringe';
import { db } from '@database/database';
import { Event, NewEvent, EventUpdate} from './events.model';

@singleton()
export class EventsService {
  /**
   * Create a new event in the database
   * @param eventData - The data for the new event
   * @returns The ID of the created event
   */
  public async createEvent(eventData: NewEvent): Promise<Event | undefined> {
    const insertedEvent = await db
      .insertInto('events')
      .values({
        start: eventData.start,
        end: eventData.end,
        venue: eventData.venue,
        title: eventData.title,
        address: eventData.address,
      })
      .returningAll()
      .executeTakeFirst();

    return insertedEvent;
  }

  /**
   * Retrieve all events from the database
   * @returns A list of events
   */
  public async getAllEvents(): Promise<Event[]> {
    return await db
      .selectFrom('events')
      .selectAll()
      .execute()
      .then(events => events.map(event => ({
        ...event,
        // volunteer_roles: event.volunteer_roles, // Directly assign volunteer_roles as it is already an array
      })));
  }

  public async getUpcomingEvents(): Promise<Event[]> {
    const currentDate = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(currentDate.getDate() + 14);

    const events = await db
      .selectFrom('events')
      .selectAll()
      .where('start', '>=', currentDate)
      .where('start', '<=', twoWeeksFromNow)
      .execute();

    return events;
  }

  /**
   * Retrieve a specific event by its ID
   * @param eventId - The ID of the event to retrieve
   * @returns The event if found, otherwise undefined
   */
  public async getEventById(eventId: number): Promise<Event | undefined> {
    const event = await db
      .selectFrom('events')
      .selectAll()
      .where('id', '=', eventId)
      .executeTakeFirst();

    return event;
  }

  /**
   * Delete an event by its ID
   * @param eventId - The ID of the event to delete
   */
  public async deleteEvent(eventId: number): Promise<void> {
    await db
      .deleteFrom('events')
      .where('id', '=', eventId)
      .execute();
  }

  public async deleteShiftsByEventId(eventId: number): Promise<void> {
    await db
      .deleteFrom('volunteer_shifts')
      .where('event_id', '=', eventId)
      .execute();
  }

  /**
   * Update an existing event in the database
   * @param eventId - The ID of the event to update
   * @param eventData - The new data for the event
   * @returns A confirmation message or updated event
   */
  public async updateEvent(eventId: number, eventData: EventUpdate): Promise<void> {
    await db
      .updateTable('events')
      .set(eventData)
      .where('id', '=', eventId)
      .execute();
  }
}
