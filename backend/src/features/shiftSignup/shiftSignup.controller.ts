import { Request, Response, NextFunction } from 'express';
import { ShiftSignupService } from './shiftSignup.service';
import { NewShiftSignup, ShiftSignupUpdate } from './shiftSignup.model';
import { VolunteerShiftsService } from '../volunteerShifts/volunteerShifts.service';
import { isAuthenticated } from '@/common/utils/auth';

export class ShiftSignupController {
  private shiftSignupService = new ShiftSignupService();
  private volunteerShiftsService = new VolunteerShiftsService();

  /**
   * Create a new shift signup
   * @route POST /api/shift-signups
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupData: NewShiftSignup = req.body;
      const shiftDetails = await this.volunteerShiftsService.getShiftById(signupData.shift_id);

      if (!shiftDetails) {
        res.status(404).json({ message: 'Shift not found' });
        return;
      }

      const signupId = await this.shiftSignupService.create(signupData);
      res.status(201).json({ message: 'Shift signup created', signupId });
    } catch (error) {
      next(error);
    }
  };

  public getUserSignups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isAuthenticated(req)) {
        res.status(401);
        return;
      }
      const shifts = await this.shiftSignupService.getShiftsSignupByUser(req.auth.uid);
      res.json(shifts);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all shift signups
   * @route GET /api/shift-signups
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signups = await this.shiftSignupService.getAllSignups();
      res.json(signups);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific shift signup by ID
   * @route GET /api/shift-signups/:id
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10);
      const signup = await this.shiftSignupService.getSignupById(signupId);

      if (!signup) {
        res.status(404).json({ message: 'Shift signup not found' });
      } else {
        res.json(signup);
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a shift signup by ID
   * @route DELETE /api/shift-signups/:id
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10);
      await this.shiftSignupService.deleteSignup(signupId);
      res.status(200).json({ message: 'Shift signup deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a shift signup by ID
   * @route PUT /api/shift-signups/:id
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10);
      const signupData: ShiftSignupUpdate = req.body as ShiftSignupUpdate;

      if (signupData.user_id === undefined || signupData.shift_id === undefined) {
        res.status(400).json({ message: 'user_id and shift_id are required' });
        return;
      }

      if (signupData.user_id !== undefined && signupData.shift_id !== undefined) {
        await this.shiftSignupService.updateSignup(signupId, signupData as { user_id: number; shift_id: number });
        res.status(200).json({ message: 'Shift signup updated successfully' });
      } else {
        res.status(400).json({ message: 'user_id and shift_id are required' });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check-in for a shift
   * @route PUT /api/shift-signups/:id/checkin
   */
  public checkIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10);
      const { checkin_time } = req.body;

      if (!checkin_time) {
        res.status(400).json({ message: 'Check-in time is required' });
        return;
      }

      await this.shiftSignupService.checkIn(signupId, new Date(checkin_time));
      res.status(200).json({ message: 'Check-in successful' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check-out from a shift
   * @route PUT /api/shift-signups/:id/checkout
   */
  public checkOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10);
      const checkoutTime = new Date(); // or use the appropriate checkout time
      await this.shiftSignupService.checkOut(signupId, checkoutTime);
      res.status(200).json({ message: 'Check-out successful' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Auto-checkout all users who forgot to check out by the shift end time.
   * @route POST /api/shift-signups/auto-checkout
   */
  public autoCheckOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.shiftSignupService.autoCheckOut();
      res.status(200).json({ message: 'Auto-checkout completed successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Auto-checkout a specific user for a shift using the shift's end time.
   * @route POST /api/shift-signups/:id/auto-checkout
   */
  public autoCheckOutById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10);
      await this.shiftSignupService.autoCheckOutById(signupId);
      res.status(200).json({ message: 'Auto-checkout for the specific signup completed successfully' });
    } catch (error) {
      next(error);
    }
  };
}
