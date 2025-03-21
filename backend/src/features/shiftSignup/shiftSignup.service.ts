import { BadRequestException } from '@nestjs/common';
import { NewShiftSignup, ShiftSignup } from './shiftSignup.model';
import { db } from '@database/database';
import { VolunteerShiftsService } from '../volunteerShifts/volunteerShifts.service';
import { singleton } from 'tsyringe';
import { ErrorResponse } from '@/common/utils/error';

type ShiftSignupUser = ShiftSignup & {
  uid: string;
  first_name: string;
  last_name: string;
}

type ShiftSignupUserBasic = {
  id: number;
  user_id: number;
  shift_id: number;
  first_name: string;
  last_name: string;
  email: string;
};

@singleton()
export class ShiftSignupService {
  private volunteerShiftsService = new VolunteerShiftsService();

  /**
   * Fetch all shift signups for an event.
   * @returns A list of all shift signups for an event
   */
  async getEventShiftSignups(eventId: number): Promise<ShiftSignupUser[]> {
    const result = await db
      .selectFrom('shift_signup')
      .innerJoin(
        (eb) => eb
          .selectFrom('volunteer_shifts')
          .select('volunteer_shifts.id')
          .where('volunteer_shifts.event_id', '=', eventId)
          .as('volunteer_shifts'),
        (join) => join
          .onRef('volunteer_shifts.id', '=', 'shift_signup.shift_id'),
      )
      .innerJoin('users', 'users.id', 'shift_signup.user_id')
      .select([
        'shift_signup.id',
        'shift_signup.user_id',
        'shift_signup.shift_id',
        'shift_signup.checkin_time',
        'shift_signup.checkout_time',
        'shift_signup.notes',
        'users.uid',
        'users.first_name',
        'users.last_name',
      ])
      .selectAll()
      .execute();
    return result;
  }

  async getShiftsSignupByUser(uid: string): Promise<ShiftSignupUser[]> {
    const result = await db
      .selectFrom('shift_signup')
      .innerJoin('users', 'users.id', 'shift_signup.user_id')
      .innerJoin('volunteer_shifts', 'volunteer_shifts.id', 'shift_signup.shift_id')
      .innerJoin('events', 'events.id', 'volunteer_shifts.event_id')
      .select([
        'shift_signup.id',
        'shift_signup.user_id',
        'shift_signup.shift_id',
        'shift_signup.checkin_time',
        'shift_signup.checkout_time',
        'shift_signup.hours_worked',
        'shift_signup.notes',
        'users.uid',
        'users.first_name',
        'users.last_name',
        'volunteer_shifts.volunteer_role',
        'volunteer_shifts.start',
        'volunteer_shifts.end',
        'events.id as event_id',
        'events.title as event_title',
      ])
      .where('users.uid', '=', uid)
      .orderBy('volunteer_shifts.start', 'asc')
      .execute();
    return result;
  }

  public async getUpcomingShifts(uid: string): Promise<ShiftSignupUser[]> {

    const currentDate = new Date();
    const twoWeeksFromNow = new Date();
    const oneDayBefore = new Date();
    oneDayBefore.setHours(currentDate.getHours() - 12);
    twoWeeksFromNow.setDate(currentDate.getDate() + 14);

    const result = await db
      .selectFrom('shift_signup')
      .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
      .innerJoin('users', 'users.id', 'shift_signup.user_id')
      .innerJoin('events', 'events.id', 'volunteer_shifts.event_id')
      .select([
        'shift_signup.id',
        'shift_signup.user_id',
        'shift_signup.shift_id',
        'shift_signup.checkin_time',
        'shift_signup.checkout_time',
        'shift_signup.hours_worked',
        'shift_signup.notes',
        'users.uid',
        'users.first_name',
        'users.last_name',
        'volunteer_shifts.volunteer_role',
        'volunteer_shifts.start',
        'volunteer_shifts.end',
        'events.id as event_id',
        'events.title as event_title',
      ])
      .where('volunteer_shifts.end', '>=', oneDayBefore)
      .where('volunteer_shifts.start', '<=', twoWeeksFromNow)
      .where('users.uid', '=', uid)
      .orderBy('volunteer_shifts.start', 'asc')
      .execute();
    return result;
  }


  /**
   * Create a new shift signup.
   * @param signupData - The data for the new signup
   * @returns The ID of the newly created signup
   */
  public async create(signupData: NewShiftSignup): Promise<ShiftSignupUser | ErrorResponse> {
    const existingSignup = await this.checkExistingSignup(signupData.user_id, signupData.shift_id);
    const isMaxReached = await this.volunteerShiftsService.hasReachedMaxVolunteers(signupData.shift_id);
    
    if (existingSignup) {
      const err: ErrorResponse = { error: 'You have already signed up for this shift.'};
      return err;
    }

    const hasConflict = await this.checkForShiftConflicts(signupData.user_id, signupData.shift_id);
    if (hasConflict) {
      const err: ErrorResponse = { error: 'This shift conflicts with another shift you have already signed up for.'};
      return err;
    }

    if (isMaxReached) {
      const err: ErrorResponse = { error: 'This shift has reached the maximum number of volunteers.'};
      return err;
    }

    const insertedSignupRes = await db
      .insertInto('shift_signup')
      .values({
        user_id: signupData.user_id,
        shift_id: signupData.shift_id,
        notes: signupData.notes || undefined,
      })
      .returning('id')
      .executeTakeFirst();

    if (insertedSignupRes === undefined) {
      throw new Error('Failed to sign up user');
    }

    const insertedSignupUser = await db
      .selectFrom('users')
      .innerJoin(
        (eb) => eb
          .selectFrom('shift_signup')
          .selectAll()
          .where('shift_signup.id', '=', insertedSignupRes.id)
          .as('shift_signup'),
        (join) => join
          .onRef('shift_signup.user_id', '=', 'users.id')
      )
      .select([
        'shift_signup.id',
        'shift_signup.user_id',
        'shift_signup.shift_id',
        'shift_signup.checkin_time',
        'shift_signup.checkout_time',
        'shift_signup.hours_worked',
        'shift_signup.notes',
        'users.uid',
        'users.first_name',
        'users.last_name',
      ])
      .executeTakeFirst();

    if (insertedSignupUser === undefined) {
      throw new Error('Failed to get created shift signup');
    }

    return insertedSignupUser;
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
      .select(['volunteer_shifts.start as shift_start', 'volunteer_shifts.end as shift_end', 'shift_signup.checkin_time as checkin_time',])
      .where('shift_signup.id', '=', signupId)
      .executeTakeFirst();
  
    if (!shiftSignup) {
      throw new Error('Shift signup not found');
    }
  
    const shiftStart = new Date(shiftSignup.shift_start);
    const shiftEnd = new Date(shiftSignup.shift_end);
    if (!shiftSignup.checkin_time) {
      throw new Error('Check-in time not found');
    }
    const checkinTime = new Date(shiftSignup.checkin_time);

  
    // Check if the checkout time is within the allowed shift period
    if (checkoutTime < shiftStart || checkoutTime > shiftEnd) {
      throw new BadRequestException('Check-out time must be within the shift period');
    }

    const hoursWorked = parseFloat(((checkoutTime.getTime() - checkinTime.getTime()) / (1000 * 60 * 60)).toFixed(2));
    
    if (hoursWorked < 0.0167) { // Less than 1 minute
      throw new BadRequestException('Check-out time must be at least 1 minute after check-in time');
    }
    // Proceed with the check-out if the time is valid
    await db
      .updateTable('shift_signup')
      .set({ checkout_time: checkoutTime, hours_worked: hoursWorked })
      .where('id', '=', signupId)
      .execute();
  }

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
        'shift_signup.checkin_time as checkin_time'
      ])
      .where('shift_signup.checkin_time', 'is not', null)
      .where('shift_signup.checkout_time', 'is', null)
      .where('volunteer_shifts.end', '<', now)
      .execute();
  
    for (const signup of overdueSignups) {
      if (!signup.checkin_time) {
        console.error(`Check-in time not found for signup ID: ${signup.id}`);
        continue;
      }
  
      const checkinTime = new Date(signup.checkin_time);
      const checkoutTime = new Date(signup.shift_end);
  
      // Calculate hours worked (rounded to two decimal places)
      const hoursWorked = parseFloat(((checkoutTime.getTime() - checkinTime.getTime()) / (1000 * 60 * 60)).toFixed(2));
  
      if (hoursWorked < 0.0167) {
        console.error(`Auto-checkout skipped for signup ID: ${signup.id} because the duration is less than 1 minute`);
        continue;
      }
  
      // Proceed with the auto-checkout if the time is valid
      await db
        .updateTable('shift_signup')
        .set({ checkout_time: checkoutTime, hours_worked: hoursWorked })
        .where('id', '=', signup.id)
        .execute();
  
      console.log(`Auto-checkout completed for signup ID: ${signup.id} with hours worked: ${hoursWorked}`);
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
  private async checkExistingSignup(user_id: number, shift_id: number): Promise<ShiftSignup | undefined> {
    const result = await db
      .selectFrom('shift_signup')
      .selectAll()
      .where('user_id', '=', user_id)
      .where('shift_id', '=', shift_id)
      .executeTakeFirst();
    return result;
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
   * Get the total number of hours worked by a specific user.
   * @param userId - The user ID to calculate total hours worked for
   * @returns Total hours worked by the user
   */
  public async getTotalHoursWorked(userId: number): Promise<number> {
    const result = await db
      .selectFrom('shift_signup')
      .select((eb) => eb.fn.sum('hours_worked').as('total_hours'))
      .where('user_id', '=', userId)
      .executeTakeFirst();

    // If result is null or undefined, return 0 as the total hours worked
    return Number(result?.total_hours ?? 0);
  }

  /**
   * Get the total hours worked by all users.
   * @returns A list of user IDs and their corresponding total hours worked
   */
  public async getTotalHoursForAllUsers(): Promise<{ user_id: number; total_hours: number }[]> {
    const results = await db
      .selectFrom('shift_signup')
      .select(['user_id'])
      .select((eb) => eb.fn.sum('hours_worked').as('total_hours'))
      .groupBy('user_id')
      .execute();

    return results.map((result) => ({
      user_id: result.user_id,
      total_hours: Number(result.total_hours ?? 0),
    }));
  }

  /**
   * Get a specific shift signup by ID.
   */
  async getSignupById(id: number): Promise<ShiftSignup | undefined> {
    const result = await db
      .selectFrom('shift_signup')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return result;
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

  async batchDeleteSignup(ids: number[]): Promise<number[]> {
    const deletedIds = await db
      .deleteFrom('shift_signup')
      .where('id', 'in', ids)
      .returning('id')
      .execute();
    return deletedIds.map(id => id.id);
  }

  async getShiftSignups(shiftId: number): Promise<ShiftSignupUserBasic[]> {
    const result = await db
      .selectFrom('shift_signup')
      .innerJoin('users', 'users.id', 'shift_signup.user_id')
      .select([
        'shift_signup.id',
        'shift_signup.user_id',
        'shift_signup.shift_id',
        'shift_signup.checkin_time',
        'shift_signup.checkout_time',
        'shift_signup.notes',
        'users.first_name',
        'users.last_name',
        'users.email',
      ])
      .where('shift_signup.shift_id', '=', shiftId)
      .execute();
    return result;
  }
}


