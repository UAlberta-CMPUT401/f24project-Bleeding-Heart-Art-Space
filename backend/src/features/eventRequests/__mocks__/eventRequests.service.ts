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
      }
      return ret;
  }),
}));
