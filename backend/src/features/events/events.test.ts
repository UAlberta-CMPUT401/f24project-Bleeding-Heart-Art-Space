import 'reflect-metadata';
import { container } from 'tsyringe';
import { EventsService } from './event.service';
import { EventsController } from './events.controller';
import request from 'supertest';
import express from 'express';

jest.mock('./event.service');

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

    app.post('/events', eventsController.createEvent);
    app.get('/events', eventsController.getAllEvents);
    app.get('/events/:id', eventsController.getEventById);
    app.put('/events/:id', eventsController.updateEvent);
    app.delete('/events/:id', eventsController.deleteEvent);
  });

  test('should create an event', async () => {
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


  test('should update an event', async () => {
    mockEventsService.updateEvent.mockResolvedValue(undefined);

    const response = await request(app)
      .put('/events/1')
      .send({
        title: 'Updated Event Title',
        start: '2024-10-16T09:00:00.000Z',
        end: '2024-10-16T17:00:00.000Z',
        venue: 'Updated Venue',
        address: '456 Updated St',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Event updated successfully' });
  });

  // test('should delete an event', async () => {
  //   // TODO: mock shifts service
  //   mockEventsService.deleteEvent.mockResolvedValue();

  //   const response = await request(app).delete('/events/1');

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ message: 'Event deleted successfully' });
  // });
});
