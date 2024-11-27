import { Request, Response, NextFunction } from 'express';
import { SendEmailsService } from './sendEmails.service';

export class SendEmailsController {
  private sendEmailsService = new SendEmailsService();

  /**
   * Send communication emails for today's shifts
   * @route POST /api/send_emails/today
   */
//   public async sendShiftEmails(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0); // Set to the start of the current day
  
//       const endOfDay = new Date();
//       endOfDay.setHours(23, 59, 59, 999); // Set to the end of the current day
  
//       const shifts = await this.sendEmailsService.getShiftsForToday(startOfDay, endOfDay);
  
//       // Convert `start` and `end` to strings (ISO format)
//       const formattedShifts = shifts.map((shift) => ({
//         ...shift,
//         start: shift.start.toISOString(),
//         end: shift.end.toISOString(),
//       }));
  
//       await this.sendEmailsService.sendShiftEmails(formattedShifts);
//       res.status(200).json({ message: 'Emails sent successfully!' });
//     } catch (error) {
//       next(error);
//     }
//   }
  public sendTodayEmails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Your logic to fetch data and send emails
        await this.sendEmailsService.sendTodayShiftEmails();

        res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('SendGrid error details:', (error as any).response?.body || error.message);
        } else {
            console.error('SendGrid error details:', error);
        }
        throw error;
      }
      
};

  
}
