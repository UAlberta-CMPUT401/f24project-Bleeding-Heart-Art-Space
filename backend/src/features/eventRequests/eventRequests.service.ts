import { container, singleton } from 'tsyringe';
import { db } from '@database/database';
import { EventRequest, EventRequestUpdate } from './eventRequests.model';
import { Event, NewEvent } from '../events/events.model';
import { UsersService } from '../users/users.service';

type EventRequestUser = EventRequest & {
  uid: string;
  first_name: string;
  last_name: string;
}

@singleton()
export class EventRequestsService {
  public usersService = container.resolve(UsersService);

  public async createEventRequest(
    uid: string, 
    eventData: {
      start: string;
      end: string;
      venue: string;
      address: string;
      title: string;
    }
  ): Promise<EventRequest | undefined> {
    const insertedEvent = await db
      .insertInto('event_requests')
      .values(({ selectFrom }) => ({
        ...eventData,
        requester_id: selectFrom('users').select('id').where('uid', '=', uid),
        status: 2, // pending
      }))
      .returningAll()
      .executeTakeFirst();

    return insertedEvent;
  }

  public async getPendingEventRequests(): Promise<EventRequestUser[]> {
    return await db
      .selectFrom('event_requests')
      .innerJoin('users', 'users.id', 'event_requests.requester_id')
      .select([
        'event_requests.id',
        'event_requests.start',
        'event_requests.end',
        'event_requests.venue',
        'event_requests.address',
        'event_requests.title',
        'event_requests.requester_id',
        'event_requests.status',
        'users.uid',
        'users.first_name',
        'users.last_name',
      ])
      .where('event_requests.status', '=', 2) // where status is pending
      .execute()
  }

  public async getUserEventRequests(uid: string): Promise<EventRequestUser[]> {
    return await db
      .selectFrom('event_requests')
      .innerJoin('users', 'users.id', 'event_requests.requester_id')
      .select([
        'event_requests.id',
        'event_requests.start',
        'event_requests.end',
        'event_requests.venue',
        'event_requests.address',
        'event_requests.title',
        'event_requests.requester_id',
        'event_requests.status',
        'users.uid',
        'users.first_name',
        'users.last_name',
      ])
      .where('users.uid', '=', uid)
      .execute()
  }

  public async getEventRequestById(eventRequestId: number): Promise<EventRequest | undefined> {
    const eventRequest = await db
      .selectFrom('event_requests')
      .selectAll()
      .where('id', '=', eventRequestId)
      .executeTakeFirst();

    return eventRequest;
  }

  public async deleteEventRequest(eventRequestId: number): Promise<void> {
    await db
      .deleteFrom('event_requests')
      .where('id', '=', eventRequestId)
      .execute();
  }

  public async updateEventRequest(eventRequestId: number, eventData: EventRequestUpdate): Promise<void> {
    await db
      .updateTable('event_requests')
      .set(eventData)
      .where('id', '=', eventRequestId)
      .execute();
  }
  
  public async confirmEventRequest(eventRequestId: number): Promise<Event | undefined> {
    const eventRequest = await this.getEventRequestById(eventRequestId);

    if (!eventRequest) return undefined;

    const newEvent: NewEvent = {
      start: eventRequest.start.toISOString(),
      end: eventRequest.end.toISOString(),
      venue: eventRequest.venue,
      address: eventRequest.address,
      title: eventRequest.title,
    }

    const event = await db
      .insertInto('events')
      .values(newEvent)
      .returningAll()
      .executeTakeFirst()

    if (!event) return undefined;

    // change event request to approved
    const approveRes = await db
      .updateTable('event_requests')
      .set({
        status: 1, // approved
      })
      .where('id', '=', eventRequest.id)
      .executeTakeFirst();
    if (approveRes.numUpdatedRows === BigInt(0)) return undefined;

    await this.usersService.makeUserEventAdmin(eventRequest.requester_id, event.id);

    return event;
  }
}
