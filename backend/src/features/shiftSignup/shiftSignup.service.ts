import { Kysely } from 'kysely';
import { BadRequestException } from '@nestjs/common';
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
    const existingSignup = await this.checkExistingSignup(signupData.user_id, signupData.shift_id);
    if (existingSignup) {
      throw new Error('You have already signed up for this shift.');
    }

    const hasConflict = await this.checkForShiftConflicts(signupData.user_id, signupData.shift_id);
    if (hasConflict) {
      throw new Error('This shift conflicts with another shift you have already signed up for.');
    }

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
   * Record check-in time for a user.
   * @param signupId - The shift signup ID
   */
  public async checkIn(signupId: number, checkinTime: Date): Promise<void> {
    // Fetch the shift details
    const shiftSignup = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .select(['volunteer_shifts.start as shift_start', 'volunteer_shifts.end as shift_end'])
      .where('shift_signup.id', '=', signupId)
      .executeTakeFirst();
  
    if (!shiftSignup) {
      throw new Error('Shift signup not found');
    }
  
    const shiftStart = new Date(shiftSignup.shift_start);
    const shiftEnd = new Date(shiftSignup.shift_end);
  
    // Check if the check-in time is within the shift's start and end times
    if (checkinTime < shiftStart || checkinTime > shiftEnd) {
      throw new BadRequestException('Check-in time must be within the shift period');
    }
  
    // Proceed with the check-in if the time is valid
    await db
      .updateTable('shift_signup')
      .set({ checkin_time: checkinTime })
      .where('id', '=', signupId)
      .execute();
  }

  /**
   * Record check-out time for a user.
   * @param signupId - The shift signup ID
   */
  public async checkOut(signupId: number, checkoutTime: Date): Promise<void> {
    // Fetch the shift details
    const shiftSignup = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .select(['volunteer_shifts.start as shift_start', 'volunteer_shifts.end as shift_end'])
      .where('shift_signup.id', '=', signupId)
      .executeTakeFirst();
  
    if (!shiftSignup) {
      throw new Error('Shift signup not found');
    }
  
    const shiftStart = new Date(shiftSignup.shift_start);
    const shiftEnd = new Date(shiftSignup.shift_end);
  
    // Check if the checkout time is within the allowed shift period
    if (checkoutTime < shiftStart || checkoutTime > shiftEnd) {
      throw new BadRequestException('Check-out time must be within the shift period');
    }
  
    // Proceed with the check-out if the time is valid
    await db
      .updateTable('shift_signup')
      .set({ checkout_time: checkoutTime })
      .where('id', '=', signupId)
      .execute();
  }

  /**
   * Automatically check out users who forgot to check out by the shift end time.
   */
  public async autoCheckOut(): Promise<void> {
    const now = new Date();

    const overdueSignups = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .select([
        'shift_signup.id',
        'shift_signup.shift_id',
        'shift_signup.checkin_time',
        'shift_signup.checkout_time',
        'volunteer_shifts.end as shift_end',
      ])
      .where('shift_signup.checkin_time', 'is not', null)
      .where('shift_signup.checkout_time', 'is', null)
      .where('volunteer_shifts.end', '<', now)
      .execute();

    for (const signup of overdueSignups) {
      await db
        .updateTable('shift_signup')
        .set({ checkout_time: signup.shift_end }) // Use shift_end as checkout time
        .where('id', '=', signup.id)
        .execute();
    }
  }

  /**
   * Auto-checkout a specific shift signup by ID using the shift’s end time.
   * @param signupId - The shift signup ID
   */
  public async autoCheckOutById(signupId: number): Promise<void> {
    const signup = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .select(['shift_signup.id', 'shift_signup.checkout_time', 'volunteer_shifts.end as shift_end'])
      .where('shift_signup.id', '=', signupId)
      .where('shift_signup.checkin_time', 'is not', null)
      .where('shift_signup.checkout_time', 'is', null)
      .executeTakeFirst();

    if (signup) {
      await db
        .updateTable('shift_signup')
        .set({ checkout_time: signup.shift_end })
        .where('id', '=', signup.id)
        .execute();
    }
  }

  /**
   * Check if a user is already signed up for a specific shift.
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
   */
  private async checkForShiftConflicts(user_id: number, shift_id: number): Promise<boolean> {
    const shiftDetails = await db
      .selectFrom('volunteer_shifts')
      .select(['start', 'end'])
      .where('id', '=', shift_id)
      .executeTakeFirst();

    if (!shiftDetails) {
      throw new Error('Shift not found');
    }

    const userShifts = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .select(['volunteer_shifts.start', 'volunteer_shifts.end'])
      .where('shift_signup.user_id', '=', user_id)
      .execute();

    for (const userShift of userShifts) {
      const userShiftStart = new Date(userShift.start);
      const userShiftEnd = new Date(userShift.end);
      const newShiftStart = new Date(shiftDetails.start);
      const newShiftEnd = new Date(shiftDetails.end);

      const isConflicting =
        (newShiftStart < userShiftEnd && newShiftEnd > userShiftStart) ||
        (userShiftStart < newShiftEnd && userShiftEnd > newShiftStart);

      if (isConflicting) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get a specific shift signup by ID.
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
   */
  async deleteSignup(id: number): Promise<void> {
    await db
      .deleteFrom('shift_signup')
      .where('id', '=', id)
      .execute();
  }
}
