import { logger } from '@utils/logger';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UsersService } from './users.service';

export class UsersController {
  public usersService = container.resolve(UsersService);

  public getIsAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.auth !== undefined) {
        res.status(200).send('true');
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
  
  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user !== undefined) {
        res.status(200).json(req.user);
      } else {
        res.status(401).json({ error: 'Missing User' });
      }
    } catch (error) {
      next(error);
    }
  }
  
  public getRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.role !== undefined) {
        res.status(200).json(req.role);
      } else {
        res.status(401).json({ error: 'Missing Role' });
      }
    } catch (error) {
      next(error);
    }
  }

}
