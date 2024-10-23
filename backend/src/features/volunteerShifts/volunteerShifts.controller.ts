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
  }

  /**
   * Create new shifts for a specific event.
   */
  public createShifts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId } = req.params;
      const shifts = req.body.shifts;

      if (!eventId || !shifts || !Array.isArray(shifts)) {
        res.status(400).json({ error: 'Event ID and valid shifts data are required' });
        return;
      }

      await this.volunteerShiftsService.createShifts(shifts.map(shift => ({ ...shift, event_id: Number(eventId) })));
      res.status(201).json({ message: 'Shifts created successfully' });
    } catch (error) {
      next(error);
    }
  }

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

      await this.volunteerShiftsService.updateShift(Number(id), shiftData);
      res.status(200).json({ message: 'Shift updated successfully' });
    } catch (error) {
      next(error);
    }
  }

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
  }
}
