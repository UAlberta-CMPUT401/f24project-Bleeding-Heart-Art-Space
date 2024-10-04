import { logger } from '@utils/logger';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UsersService } from './users.service';

export class UsersController {
  public usersService = container.resolve(UsersService);

  public getIsAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).send('authorized');
    } catch (error) {
      next(error);
    }
  }

}
