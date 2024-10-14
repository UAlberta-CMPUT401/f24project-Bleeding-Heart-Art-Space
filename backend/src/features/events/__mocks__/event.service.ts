// __mocks__/events.service.ts

export class EventsService {
    createEvent = jest.fn().mockResolvedValue(1); // Mocks returning a new event ID of 1 by default
  
    getAllEvents = jest.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Mock Event',
        start: '2024-10-15T09:00:00.000Z',
        end: '2024-10-15T17:00:00.000Z',
        venue: 'Mock Venue',
        address: '123 Mock St',
      },
    ]);
  
    getEventById = jest.fn().mockResolvedValue({
      id: 1,
      title: 'Mock Event',
      start: '2024-10-15T09:00:00.000Z',
      end: '2024-10-15T17:00:00.000Z',
      venue: 'Mock Venue',
      address: '123 Mock St',
    });
  
    updateEvent = jest.fn().mockResolvedValue(true); // Mocks successful update
  
    deleteEvent = jest.fn().mockResolvedValue(true); // Mocks successful deletion
  }