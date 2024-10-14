import { User, Role } from '../users.model';
import { InsertResult, UpdateResult } from 'kysely';

export const UsersService = jest.fn().mockImplementation(() => ({
  getUser: jest.fn().mockImplementation(async (uid: string) => {
    if (uid === "test_uid") {
      const ret: User = {
        id: 1,
        uid: "test_uid",
        first_name: "test_first_name",
        last_name: "test_last_name",
        email: "test_email",
        role: 1
      }
      return ret;
    } else {
      return undefined;
    }
  }),
  createVolunteer: jest.fn().mockResolvedValue(new InsertResult(BigInt(1), BigInt(1))),
  getUserRole: jest.fn().mockImplementation(async (user: User) => {
    if (user.role === 1) {
      const ret: Role = {
        id: 1,
        title: "volunteer",
        can_take_shift: true,
        can_request_event: false,
        is_admin: false,
        is_blocked: false,
      }
      return ret;
    } else {
      return undefined;
    }
  }),
  setUserRole: jest.fn().mockResolvedValue(new UpdateResult(BigInt(1), BigInt(1))),
}));
