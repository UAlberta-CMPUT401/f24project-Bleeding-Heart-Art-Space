import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { VolunteerShiftsService } from './volunteerShifts.service';
import { isAuthenticated } from '@/common/utils/auth';
import { UsersService } from '../users/users.service';

export class VolunteerShiftsController {
  public volunteerShiftsService = container.resolve(VolunteerShiftsService);
  public usersService = container.resolve(UsersService);

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
      if (!isAuthenticated(req)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const eventId = parseInt(req.params.eventId);
      const shifts = req.body;
      const isEventAdmin = await this.usersService.isEventAdmin(req.auth.uid, { eventId });
      if (!isEventAdmin && !req.role?.is_admin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!eventId || !shifts || !Array.isArray(shifts)) {
        res.status(400).json({ error: 'Event ID and valid shifts data are required' });
        return;
      }

      // Ensure the volunteer_role is a string and passes correct data
      const shiftsWithEventId = shifts.map((shift) => ({
        ...shift,
        event_id: eventId,
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
      if (!isAuthenticated(req)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const id = parseInt(req.params.id);
      if (!id) {
        res.status(400).json({ error: 'Shift ID is required' });
        return;
      }
      const shiftData = req.body;
      const isEventAdmin = await this.usersService.isEventAdmin(req.auth.uid, { shiftId: id });
      if (!isEventAdmin && !req.role?.is_admin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

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
      if (!isAuthenticated(req)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const id = parseInt(req.params.id);
      if (!id) {
        res.status(400).json({ error: 'Shift ID is required' });
        return;
      }
      const isEventAdmin = await this.usersService.isEventAdmin(req.auth.uid, { shiftId: id });
      if (!isEventAdmin && !req.role?.is_admin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await this.volunteerShiftsService.deleteShift(Number(id));
      res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
