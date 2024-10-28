import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

// Define the table structure for volunteer_shifts
export interface VolunteerShiftsTable {
  id: Generated<number>;         // Primary key
  event_id: number;              // Foreign key referencing the event
  user_id: number;              // Foreign key referencing the user (optional)
  volunteer_role: number;        // Volunteer role for the shift (stored as an integer referencing volunteer_roles.id)
  start: ColumnType<Date, string | undefined, never>;  // Start time of the shift
  end: ColumnType<Date, string | undefined, never>;    // End time of the shift
  max_volunteers: number;
  description?: string;          // Optional description of the shift
}

// Define the types for Selectable, Insertable, and Updateable rows
export type VolunteerShift = Selectable<VolunteerShiftsTable>;
export type NewVolunteerShift = Insertable<VolunteerShiftsTable>;
export type VolunteerShiftUpdate = Updateable<VolunteerShiftsTable>;
