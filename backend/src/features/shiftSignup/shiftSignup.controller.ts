import { Request, Response, NextFunction } from 'express';
import { ShiftSignupService } from './shiftSignup.service';
import { NewShiftSignup, ShiftSignupUpdate } from './shiftSignup.model';
import { VolunteerShiftsService } from '../volunteerShifts/volunteerShifts.service'; // Import the VolunteerShiftsService

export class ShiftSignupController {
  private shiftSignupService = new ShiftSignupService();
  private VolunteerShiftsService = new VolunteerShiftsService(); // Create an instance of VolunteerShiftsService

  /**
   * Create a new shift signup
   * @route POST /api/shift-signups
   * @access Public (Adjust as needed)
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupData: NewShiftSignup = req.body; // Ensure request body conforms to NewShiftSignup schema

      // Fetch shift details (start, end, role) before creating the signup
      const shiftDetails = await this.VolunteerShiftsService.getShiftById(signupData.shift_id); // Use getShiftById from VolunteerShiftsService

      if (!shiftDetails) {
        res.status(404).json({ message: 'Shift not found' });
        return;
      }

      const finalSignupData = {
        ...signupData,
        shift_start: shiftDetails.start.toISOString(),  // Convert start time to ISO string
        shift_end: shiftDetails.end.toISOString(),      // Convert end time to ISO string
        volunteer_role_id: shiftDetails.volunteer_role, // Add volunteer role from the shift
      };

      const signupId = await this.shiftSignupService.create(finalSignupData);
      res.status(201).json({ message: 'Shift signup created', signupId });
    } catch (error) {
      next(error); // Pass error to global error handler middleware
    }
  };
  /**
   * Get all shift signups
   * @route GET /api/shift-signups
   * @access Public (Adjust as needed)
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signups = await this.shiftSignupService.getAllSignups();
      res.json(signups); // Respond with the array of shift signups
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific shift signup by ID
   * @route GET /api/shift-signups/:id
   * @access Public (Adjust as needed)
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10); // Convert ID parameter to an integer
      const signup = await this.shiftSignupService.getSignupById(signupId);

      if (!signup) {
        res.status(404).json({ message: 'Shift signup not found' });
      } else {
        res.json(signup); // Respond with the shift signup details
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a shift signup by ID
   * @route DELETE /api/shift-signups/:id
   * @access Public (Adjust as needed)
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10); // Convert ID parameter to an integer
      await this.shiftSignupService.deleteSignup(signupId);
      res.status(200).json({ message: 'Shift signup deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update an existing shift signup
   * @route PUT /api/shift-signups/:id
   * @access Public (Adjust as needed)
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupId = parseInt(req.params.id, 10); // Extract and parse the shift signup ID from the request parameters
      const signupData: ShiftSignupUpdate = req.body; // The updated shift signup data

      if (signupData.user_id === undefined || signupData.shift_id === undefined) {
        res.status(400).json({ message: 'user_id and shift_id are required' });
        return;
      }
      if (signupData.user_id !== undefined && signupData.shift_id !== undefined) {
        await this.shiftSignupService.updateSignup(signupId, signupData as { user_id: number; shift_id: number; id?: number; notes?: string });
        res.status(200).json({ message: 'Shift signup updated successfully' });
      } else {
        res.status(400).json({ message: 'user_id and shift_id are required' });
      }
    } catch (error) {
      next(error);
    }
  };
}
