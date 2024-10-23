// src/features/volunteerShifts/volunteerShifts.route.ts

import { Router } from 'express';
import { VolunteerShiftsController } from './volunteerShifts.controller';

const shiftsController = new VolunteerShiftsController();
const router = Router();

// Define routes for volunteer shifts
router.get('/events/:eventId/shifts', (req, res) => shiftsController.getShiftsByEvent(req, res));
router.post('/events/:eventId/shifts', (req, res) => shiftsController.createShifts(req, res));

export default router;
