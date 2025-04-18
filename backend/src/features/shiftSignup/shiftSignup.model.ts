// Import necessary Kysely types
import { Generated, Insertable, Selectable, Updateable } from 'kysely';

// Define the table structure for shift signup
export interface ShiftSignupTable {
  id: Generated<number>;
  user_id: number;  // User ID for the signup
  shift_id: number;  // Shift ID for the signup
  checkin_time?: Date | string | undefined;  // Nullable Date for check-in time
  checkout_time?: Date | string | undefined; // Nullable Date for check-out time
  hours_worked?: number | null;  // Nullable number for hours worked
  notes?: string;  // Optional field for additional signup notes
}

// Define the types for Selectable, Insertable, and Updateable rows
export type ShiftSignup = Selectable<ShiftSignupTable>;
export type NewShiftSignup = Insertable<ShiftSignupTable>;
export type ShiftSignupUpdate = Updateable<ShiftSignupTable>;
