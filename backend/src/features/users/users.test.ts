import request from 'supertest';
import express from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { container } from "tsyringe";

jest.mock('./users.service');
jest.mock("tsyringe", () => ({
  container: {
    resolve: jest.fn(),
  },
}))

describe('UsersController', () => {
  let app: express.Application;
  let mockUsersService: jest.Mocked<UsersService>;
  let usersController: UsersController;
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
    mockUsersService = new UsersService() as jest.Mocked<UsersService>;
    (container.resolve as jest.Mock).mockReturnValue(mockUsersService);
    usersController = new UsersController();
  });


  it('should fail to authenticate', async () => {
    app.get('/users/is-signed-in', usersController.getIsAuth)

    await request(app)
      .get('/users/is-signed-in')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('should authenticate', async () => {
    app.use((req, res, next) => {
      req.auth = auth;
      next();
    });
    app.get('/users/is-signed-in', usersController.getIsAuth)

    const response = await request(app)
      .get('/users/is-signed-in')
      .expect('Content-Type', /text\/plain/)
      .expect(200);

    expect(response.text).toEqual('true');
  });

  it('should get user', async () => {
    app.use(async (req, res, next) => {
      req.auth = auth;
      req.user = await mockUsersService.getUser(auth.uid);
      next();
    });
    app.get('/users/user', usersController.getUser)

    const response = await request(app)
      .get('/users/user')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      uid: "test_uid",
      first_name: "test_first_name",
      last_name: "test_last_name",
      email: "test_email",
      phone: '12345678910',
      role: 1
    });
  });

  it('should fail to create volunteer user because user already exists', async () => {
    app.use((req, res, next) => {
      req.auth = auth;
      next();
    });
    app.post('/users/user', usersController.createVolunteer)

    await request(app)
      .post('/users/user')
      .send({
        first_name: 'test_first_name',
        last_name: 'test_last_name',
        email: 'test_email',
        phone: '12345678910',
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should create volunteer user', async () => {
    app.use((req, res, next) => {
      req.auth = {
        ...auth,
        uid: 'test_2',
      }
      next();
    });
    app.post('/users/user', usersController.createVolunteer)

    await request(app)
      .post('/users/user')
      .send({
        first_name: 'test_first_name',
        last_name: 'test_last_name',
        email: 'test_email',
        phone: '12345678910',
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('should get user role', async () => {
    app.use(async (req, res, next) => {
      req.auth = auth;
      req.user = await mockUsersService.getUser(auth.uid);
      if (req.user !== undefined) {
        req.role = await mockUsersService.getUserRole(req.user);
      }
      next();
    });
    app.get('/users/role', usersController.getRole)

    const response = await request(app)
      .get('/users/role')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      title: "volunteer",
      can_take_shift: true,
      can_request_event: false,
      is_admin: false,
      is_blocked: false,
    });
  });

});
