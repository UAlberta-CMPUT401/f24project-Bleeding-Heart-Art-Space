import 'reflect-metadata';
import { container } from 'tsyringe';
import { EventsService } from './event.service';
import { UsersService } from '../users/users.service';
import { EventsController } from './events.controller';
import request from 'supertest';
import express from 'express';

jest.mock('./event.service');
jest.mock('../users/users.service');

jest.mock('tsyringe', () => {
  const actual = jest.requireActual('tsyringe');
  return {
    ...actual,
    container: {
      resolve: jest.fn(),
    },
  };
});

describe('EventsController', () => {
  let app: express.Application;
  let mockEventsService: jest.Mocked<EventsService>;
  let eventsController: EventsController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockEventsService = new EventsService() as jest.Mocked<EventsService>;
    (container.resolve as jest.Mock).mockReturnValue(mockEventsService);

    eventsController = new EventsController();

  });

  test('should create an event', async () => {
    app.post('/events', eventsController.createEvent);
    mockEventsService.createEvent.mockResolvedValue({
      id: 1,
      start: new Date('2024-10-15T09:00:00.000Z'),
      end: new Date('2024-10-15T17:00:00.000Z'),
      venue: 'Test Venue',
      address: '123 Test St',
      title: 'Test Event'
    });
    
    const response = await request(app)
      .post('/events')
      .send({
        title: 'Test Event',
        start: '2024-10-15T09:00:00.000Z',
        end: '2024-10-15T17:00:00.000Z',
        venue: 'Test Venue',
        address: '123 Test St',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      start: new Date('2024-10-15T09:00:00.000Z').toISOString(),
      end: new Date('2024-10-15T17:00:00.000Z').toISOString(),
      venue: 'Test Venue',
      address: '123 Test St',
      title: 'Test Event'
    });
  });


  // TODO: fix auth errors in tests
  // test('should update an event', async () => {
    // app.put('/events/:id', eventsController.updateEvent);
  //   mockEventsService.updateEvent.mockResolvedValue(undefined);

  //   const response = await request(app)
  //     .put('/events/1')
  //     .send({
  //       title: 'Updated Event Title',
  //       start: '2024-10-16T09:00:00.000Z',
  //       end: '2024-10-16T17:00:00.000Z',
  //       venue: 'Updated Venue',
  //       address: '456 Updated St',
  //     });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ message: 'Event updated successfully' });
  // });

  // test('should delete an event', async () => {
    // app.delete('/events/:id', eventsController.deleteEvent);
  //   mockEventsService.deleteEvent.mockResolvedValue();

  //   const response = await request(app).delete('/events/1');

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ message: 'Event deleted successfully' });
  // });
});
