import { EventRequest } from "../eventRequests.model";

export const EventRequestsService = jest.fn().mockImplementation(() => ({
  createEventRequest: jest.fn().mockImplementation(async (
    uid: string,
    eventData: {
      start: string;
      end: string;
      venue: string;
      address: string;
      title: string;
    },
  ): Promise<EventRequest | undefined> => {
      const ret: EventRequest = {
        id: 1,
        venue: eventData.venue,
        address: eventData.address,
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        requester_id: 1,
        status: 2,
      }
      return ret;
  }),
  getPendingEventRequests: jest.fn().mockResolvedValue([
    {
      id: 1,
      start: new Date('2024-10-15T09:00:00.000Z'),
      end: new Date('2024-10-15T17:00:00.000Z'),
      venue: 'Test Venue',
      address: 'Test Addr',
      title: 'Test Title',
      requester_id: 1,
      uid: 'test_uid',
      first_name: 'first',
      last_name: 'last',
      email: 'a@test.com',
      status: 2,
    },
  ]),
  getEventRequestById: jest.fn().mockImplementation(async (
    eventRequestId: number,
  ): Promise<EventRequest | undefined> => {
      if (eventRequestId !== 1) {
        return undefined;
      }
      const ret: EventRequest = {
        id: 1,
        start: new Date('2024-10-15T09:00:00.000Z'),
        end: new Date('2024-10-15T17:00:00.000Z'),
        venue: 'Test Venue',
        address: 'Test Addr',
        title: 'Test Title',
        requester_id: 1,
        status: 2,
      }
      return ret;
  }),
}));
