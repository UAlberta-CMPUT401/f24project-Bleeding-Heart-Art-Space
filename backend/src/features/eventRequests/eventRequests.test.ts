import request from 'supertest';
import express from 'express';
import { EventRequestsService } from './eventRequests.service'
import { EventRequestsController } from './eventRequests.controller';
import { container } from "tsyringe";

jest.mock('./eventRequests.service');
jest.mock("tsyringe", () => ({
  container: {
    resolve: jest.fn(),
  },
}))

describe('UsersController', () => {
  let app: express.Application;
  let mockErService: jest.Mocked<EventRequestsService>;
  let erController: EventRequestsController;
  const auth = {
    aud: 'projId',
    auth_time: 123,
    email: 'test_email',
    email_verified: true,
    exp: 100000000,
    firebase: {
        identities: {},
        sign_in_provider: 'password',
    },
    iat: 1234,
    iss: 'url',
    sub: 'test_uid',
    uid: 'test_uid',
  }

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockErService = new EventRequestsService() as jest.Mocked<EventRequestsService>;
    (container.resolve as jest.Mock).mockReturnValue(mockErService);
    erController = new EventRequestsController();
  });


  it('should create event request', async () => {
    app.use((req, res, next) => {
      req.auth = auth;
      next();
    });
    app.post('/event_requests', erController.createEventRequest)

    const response = await request(app)
      .post('/event_requests')
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
      title: 'Test Event',
      start: new Date('2024-10-15T09:00:00.000Z').toISOString(),
      end: new Date('2024-10-15T17:00:00.000Z').toISOString(),
      venue: 'Test Venue',
      address: '123 Test St',
      requester_id: 1,
    });
  });

});
