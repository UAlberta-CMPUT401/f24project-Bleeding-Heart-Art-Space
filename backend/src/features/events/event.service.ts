import { singleton } from 'tsyringe';
import { Database, db } from '@database/database';
import { Event, NewEvent, EventUpdate, NewEventRequest } from './events.model';
import { Kysely } from 'kysely';

@singleton()
export class EventsService {
  /**
   * Create a new event in the database
   * @param eventData - The data for the new event
   * @returns The ID of the created event
   */
  public async createEvent(eventData: NewEvent): Promise<Event | undefined> {
    const insertedEventRes = await db
      .insertInto('events')
      .values({
        start: eventData.start,
        end: eventData.end,
        venue: eventData.venue,
        title: eventData.title,
        address: eventData.address,
      })
      .returning('id')
      .executeTakeFirst();

    if (insertedEventRes === undefined) {
      return undefined;
    }

    const insertedEvent = await db
      .selectFrom('events')
      .selectAll()
      .where('id', '=', insertedEventRes.id)
      .executeTakeFirst();

    if (insertedEvent === undefined) {
      return undefined;
    }

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

  public async deleteShiftsByEventId(eventId: number): Promise<void> {
    await db
      .deleteFrom('volunteer_shifts' as any)
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


export class EventRequestsService {
  public async createEventRequest(eventData: NewEventRequest): Promise<number> {
    const [insertedEvent] = await db
      .insertInto('event_requests')
      .values({
        start: eventData.start,
        end: eventData.end,
        venue: eventData.venue,
        title: eventData.title,
        address: eventData.address,
        requester: eventData.requester,
      })
      .returning('id')
      .execute();

    return insertedEvent.id;
  }

  public async getAllEventRequests(): Promise<Event[]> {
    return await db
      .selectFrom('event_requests')
      .selectAll()
      .execute()
      .then(events => events.map(event => ({
        ...event,
      })));
  }

  public async getEventRequestById(eventId: number): Promise<Event | undefined> {
    const event = await db
      .selectFrom('event_requests')
      .selectAll()
      .where('id', '=', eventId)
      .executeTakeFirst();

    return event;
  }

  public async deleteEventRequest(eventId: number): Promise<void> {
    await db
      .deleteFrom('event_requests' as any)
      .where('id', '=', eventId)
      .execute();
  }

  public async updateEventRequest(eventId: number, eventData: EventUpdate): Promise<void> {
    await db
      .updateTable('event_requests')
      .set(eventData)
      .where('id', '=', eventId)
      .execute();
  }
  
  public async getRequesterFullName(requesterId: number): Promise<{ firstName: string, lastName: string } | null> {
    const requester = await db
        .selectFrom('users') // Assuming 'users' table holds the requester info
        .select(['first_name', 'last_name']) // Assuming these columns exist
        .where('id', '=', requesterId)
        .executeTakeFirst();
    return requester ? { firstName: requester.first_name, lastName: requester.last_name } : null;
  }
}
