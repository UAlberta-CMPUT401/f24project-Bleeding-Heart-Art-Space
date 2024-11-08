import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UsersService } from './users.service';
import { isAuthenticated } from '@/common/utils/auth';

export class UsersController {
  public usersService = container.resolve(UsersService);

  public getIsAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.auth !== undefined) {
        res.status(200).type('text/plain').send('true');
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }

  public createVolunteer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.auth === undefined) {
        res.status(401).json({ error: 'Missing auth token' });
        return;
      }
      if (req.body === undefined) {
        res.status(400).json({ error: "Missing body" });
        return;
      }
      if (req.body.first_name === undefined ||
        req.body.last_name === undefined) {
        res.status(400).json({ error: "Missing fields in body" });
        return;
      }
      if (await this.usersService.getUser(req.auth.uid) !== undefined) {
        res.status(400).json({ error: "User already exists" });
        return;
      }
      if (req.auth.email === undefined) {
        res.status(500).json({ error: "Email doesn't exist in auth token" });
        return;
      }
      const result = await this.usersService.createVolunteer({
        uid: req.auth.uid,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.auth.email,
        phone: req.body.phone,
      });
      if (result.numInsertedOrUpdatedRows === BigInt(0)) {
        res.status(500).json({ error: "Create failed" });
        return;
      }
      res.status(200).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  }
  
  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user === undefined) {
        res.status(401).json({ error: 'Missing User' });
        return;
      }
      res.status(200).json(req.user);
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

  public getUserAndRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isAuthenticated(req)) {
        res.status(401);
        return;
      }
      const userAndRole = await this.usersService.getUserAndRole(req.auth.uid);
      if (userAndRole === undefined) {
        res.status(400).json({ error: "Missing user and role" });
        return;
      }
      res.status(200).json(userAndRole);
    } catch (error) {
      next(error);
    }
  }

}
