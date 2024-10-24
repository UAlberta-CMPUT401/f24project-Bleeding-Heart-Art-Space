import { singleton } from 'tsyringe';
import { db } from '@database/database';
import { VolunteerShift, NewVolunteerShift, VolunteerShiftUpdate } from './volunteerShifts.model';

@singleton()
export class VolunteerShiftsService {
  /**
   * Create new volunteer shifts for an event
   * @param shiftsData - The data for the new volunteer shifts
   * @returns The IDs of the created shifts
   */
  public async createShifts(shiftsData: NewVolunteerShift[]): Promise<number[]> {
    const insertedShifts = await db
      .insertInto('volunteer_shifts')
      .values(shiftsData)
      .returning('id')
      .execute();

    return insertedShifts.map(shift => shift.id);
  }

  /**
   * Retrieve all shifts for a specific event by its ID
   * @param eventId - The ID of the event to retrieve shifts for
   * @returns A list of volunteer shifts
   */
  public async getShiftsByEvent(eventId: number): Promise<VolunteerShift[]> {
    return await db
      .selectFrom('volunteer_shifts')
      .selectAll()
      .where('event_id', '=', eventId)
      .execute();
  }

  /**
   * Retrieve a specific shift by its ID
   * @param shiftId - The ID of the shift to retrieve
   * @returns The volunteer shift if found, otherwise undefined
   */
  public async getShiftById(shiftId: number): Promise<VolunteerShift | undefined> {
    return await db
      .selectFrom('volunteer_shifts')
      .selectAll()
      .where('id', '=', shiftId)
      .executeTakeFirst();
  }

  /**
   * Delete a shift by its ID
   * @param shiftId - The ID of the shift to delete
   */
  public async deleteShift(shiftId: number): Promise<void> {
    await db
      .deleteFrom('volunteer_shifts')
      .where('id', '=', shiftId)
      .execute();
  }

  /**
   * Update an existing volunteer shift
   * @param shiftId - The ID of the shift to update
   * @param shiftData - The new data for the shift
   */
  public async updateShift(shiftId: number, shiftData: VolunteerShiftUpdate): Promise<void> {
    await db
      .updateTable('volunteer_shifts')
      .set(shiftData)
      .where('id', '=', shiftId)
      .execute();
  }

  /**
   * Check if the maximum number of volunteers for a shift has been reached
   * @param shiftId - The ID of the shift to check
   * @returns A boolean indicating if the max volunteers have been reached
   */
  public async hasReachedMaxVolunteers(shiftId: number): Promise<boolean> {
    const shiftDetails = await db
      .selectFrom('volunteer_shifts')
      .select(['max_volunteers'])
      .where('id', '=', shiftId)
      .executeTakeFirst();

    if (!shiftDetails) {
      throw new Error('Shift not found');
    }

    const existingSignups = await db
      .selectFrom('shift_signup')
      .select('id')
      .where('shift_id', '=', shiftId)
      .execute();

    return existingSignups.length >= shiftDetails.max_volunteers;
  }
}
