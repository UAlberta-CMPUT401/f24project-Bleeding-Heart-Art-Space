import { Router, Request, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { SendEmailsController } from '@features/sendEmails/sendEmails.controller';
import { authMiddleware, firebaseAuthMiddleware, isAdminMiddleware, userMiddleware } from '@middlewares/auth.middleware';

export class SendEmailsRoute implements Routes {
  public path = '/send_emails';
  public router = Router();
  private sendEmailsController = new SendEmailsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
        `${this.path}/today`,
        // authMiddleware,
        // isAdminMiddleware,
        this.sendEmailsController.sendTodayEmails
    );
}

  /**
   * Helper function to handle async controller methods and catch errors.
   * @param fn - Controller function to wrap with error handling.
   */
  private asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
