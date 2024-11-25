import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { VolunteerShiftsService } from './volunteerShifts.service';

export class VolunteerShiftsController {
  public volunteerShiftsService = container.resolve(VolunteerShiftsService);

  /**
   * Retrieve all shifts for a specific event.
   */
  public getShiftsByEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        res.status(400).json({ error: 'Event ID is required' });
        return;
      }

      const shifts = await this.volunteerShiftsService.getShiftsByEvent(Number(eventId));
      res.status(200).json(shifts);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Create new shifts for a specific event.
   */
  public createShifts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId } = req.params;
      const shifts = req.body;

      if (!eventId || !shifts || !Array.isArray(shifts)) {
        res.status(400).json({ error: 'Event ID and valid shifts data are required' });
        return;
      }

      // Ensure the volunteer_role is a string and passes correct data
      const shiftsWithEventId = shifts.map((shift) => ({
        ...shift,
        event_id: Number(eventId), // Convert eventId to number
        volunteer_role: String(shift.volunteer_role), // Ensure volunteer_role is a string
        start: new Date(shift.start).toISOString(), // Ensure start is ISO 8601
        end: new Date(shift.end).toISOString(),     // Ensure end is ISO 8601
      }));

      const insertedShifts = await this.volunteerShiftsService.createShifts(shiftsWithEventId);
      res.status(201).json(insertedShifts);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a specific shift.
   */
  public updateShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const shiftData = req.body;

      if (!id || !shiftData) {
        res.status(400).json({ error: 'Shift ID and data are required' });
        return;
      }

      // Ensure volunteer_role is a string if updated
      if (shiftData.volunteer_role) {
        shiftData.volunteer_role = String(shiftData.volunteer_role);
      }

      await this.volunteerShiftsService.updateShift(Number(id), shiftData);
      res.status(200).json({ message: 'Shift updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a specific shift by ID.
   */
  public deleteShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Shift ID is required' });
        return;
      }

      await this.volunteerShiftsService.deleteShift(Number(id));
      res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
