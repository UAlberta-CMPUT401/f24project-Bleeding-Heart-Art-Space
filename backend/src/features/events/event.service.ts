import { singleton } from 'tsyringe';
import { db } from '@database/database';
import { Event, NewEvent, EventUpdate } from './events.model';

@singleton()
export class EventsService {
  /**
   * Create a new event in the database
   * @param eventData - The data for the new event
   * @returns The ID of the created event
   */
  public async createEvent(eventData: NewEvent): Promise<number> {
    const [insertedEvent] = await db
      .insertInto('events')
      .values({
        start: eventData.start,
        end: eventData.end,
        venue: eventData.venue,
        title: eventData.title,
        address: eventData.address,
        // number_of_artists: eventData.number_of_artists,
        // number_of_volunteers: eventData.number_of_volunteers,
        // volunteer_roles: eventData.volunteer_roles, // Store volunteer_roles directly as an array
        // date: eventData.date,
      })
      .returning('id')
      .execute();

    return insertedEvent.id;
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

    if (event) {
      // volunteer_roles is already an array, no need to parse
    }
    return event;
  }

  /**
   * Delete an event by its ID
   * @param eventId - The ID of the event to delete
   */
  public async deleteEvent(eventId: number): Promise<void> {
    await db
      .deleteFrom('events' as any)
      .where('id', '=', eventId)
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
