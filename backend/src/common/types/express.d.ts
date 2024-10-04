import { DecodedIdToken } from 'firebase-admin/auth';
import { User, Role } from '@features/users/users.model'

declare global {
  namespace Express {
    interface Request {
      auth?: DecodedIdToken;
      user?: User;
      role?: Role;
    }
  }
}
