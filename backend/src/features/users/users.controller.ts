import { logger } from '@utils/logger';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UsersService } from './users.service';

export class UsersController {
  public usersService = container.resolve(UsersService);
}
