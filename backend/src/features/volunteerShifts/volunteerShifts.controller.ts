// src/features/volunteerShifts/volunteerShifts.controller.ts

import { Request, Response } from 'express';
import { VolunteerShiftsService } from './volunteerShifts.service';
import { container } from 'tsyringe';
import { NewVolunteerRole } from './volunteerShifts.model';

export class VolunteerShiftsController {
  private service: VolunteerShiftsService;

  constructor() {
    this.service = container.resolve(VolunteerShiftsService);
  }

  // Get shifts for a specific event
  async getShiftsByEvent(req: Request, res: Response): Promise<void> {
    const { eventId } = req.params;

    try {
      const shifts = await this.service.getShiftsByEvent(Number(eventId));
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving shifts', error });
    }
  }

  // Create new shifts for an event
  async createShifts(req: Request, res: Response): Promise<void> {
    const { eventId } = req.params;
    const { shifts } = req.body as { shifts: NewVolunteerRole[] }; // Updated type

    try {
      const createdShifts = await this.service.createShifts(shifts);
      res.status(201).json(createdShifts);
    } catch (error) {
      res.status(500).json({ message: 'Error creating shifts', error });
    }
  }
}
