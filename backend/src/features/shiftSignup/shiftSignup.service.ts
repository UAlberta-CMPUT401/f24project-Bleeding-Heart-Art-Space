import { Kysely } from 'kysely';
import { ShiftSignupTable, NewShiftSignup } from './shiftSignup.model';
import { db } from '@database/database';
import { VolunteerShiftsService } from '../volunteerShifts/volunteerShifts.service';
import { singleton } from 'tsyringe';

@singleton()
export class ShiftSignupService {
  private volunteerShiftsService = new VolunteerShiftsService();

  /**
   * Fetch all shift signups.
   * @returns A list of all shift signups
   */
  async getAllSignups(): Promise<ShiftSignupTable[]> {
    const result = await db
      .selectFrom('shift_signup')
      .selectAll()
      .execute();
    return result as unknown as ShiftSignupTable[];
  }

  /**
   * Create a new shift signup.
   * @param signupData - The data for the new signup
   * @returns The ID of the newly created signup
   */
  public async create(signupData: NewShiftSignup): Promise<number> {
    // Check if the user is already signed up for this shift
    const existingSignup = await this.checkExistingSignup(signupData.user_id, signupData.shift_id);
    if (existingSignup) {
      throw new Error('You have already signed up for this shift.');
    }

    // Check for conflicting shifts
    const hasConflict = await this.checkForShiftConflicts(signupData.user_id, signupData.shift_id);
    if (hasConflict) {
      throw new Error('This shift conflicts with another shift you have already signed up for.');
    }

    // Insert the shift signup (only `user_id` and `shift_id` are included)
    const [insertedSignup] = await db
      .insertInto('shift_signup')
      .values({
        user_id: signupData.user_id,
        shift_id: signupData.shift_id,
      })
      .returning('id')
      .execute();

    return insertedSignup.id;
  }

  /**
   * Check if a user is already signed up for a specific shift.
   * @param user_id - The user ID
   * @param shift_id - The shift ID
   * @returns The signup record if found, otherwise undefined
   */
  private async checkExistingSignup(user_id: number, shift_id: number): Promise<ShiftSignupTable | undefined> {
    const result = await db
      .selectFrom('shift_signup')
      .selectAll()
      .where('user_id', '=', user_id)
      .where('shift_id', '=', shift_id)
      .executeTakeFirst();
    return result as ShiftSignupTable | undefined;
  }

  /**
   * Check if the shift times conflict with any existing shift signups.
   * @param user_id - The user ID
   * @param shift_id - The shift ID
   * @returns A boolean indicating whether there is a conflict
   */
  private async checkForShiftConflicts(user_id: number, shift_id: number): Promise<boolean> {
    // Get the shift details for the shift the user is trying to sign up for
    const shiftDetails = await db
      .selectFrom('volunteer_shifts')
      .select(['start', 'end'])
      .where('id', '=', shift_id)
      .executeTakeFirst();

    if (!shiftDetails) {
      throw new Error('Shift not found');
    }

    // Get all shifts the user is already signed up for
    const userShifts = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .select(['volunteer_shifts.start', 'volunteer_shifts.end'])
      .where('shift_signup.user_id', '=', user_id)
      .execute();

    // Check for time conflicts by ensuring the shifts do not overlap
    for (const userShift of userShifts) {
      const userShiftStart = new Date(userShift.start);
      const userShiftEnd = new Date(userShift.end);
      const newShiftStart = new Date(shiftDetails.start);
      const newShiftEnd = new Date(shiftDetails.end);

      const isConflicting =
        (newShiftStart < userShiftEnd && newShiftEnd > userShiftStart) || // new shift starts before the user's shift ends and ends after user's shift starts
        (userShiftStart < newShiftEnd && userShiftEnd > newShiftStart);   // user's shift starts before the new shift ends and ends after the new shift starts

      if (isConflicting) {
        return true;
      }
    }

    return false;
  }
  /**
   * Get a specific shift signup by ID.
   * @param id - The signup ID
   * @returns The signup record if found, otherwise undefined
   */
  async getSignupById(id: number): Promise<ShiftSignupTable | undefined> {
    const result = await db
      .selectFrom('shift_signup')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return result as ShiftSignupTable | undefined;
  }

  /**
   * Update a shift signup by ID.
   * @param id - The signup ID
   * @param signupUpdate - The new data for the signup
   */
  async updateSignup(id: number, signupUpdate: NewShiftSignup): Promise<void> {
    await db
      .updateTable('shift_signup')
      .set(signupUpdate)
      .where('id', '=', id)
      .execute();
  }

  /**
   * Delete a shift signup by ID.
   * @param id - The signup ID
   */
  async deleteSignup(id: number): Promise<void> {
    await db
      .deleteFrom('shift_signup')
      .where('id', '=', id)
      .execute();
  }
}
