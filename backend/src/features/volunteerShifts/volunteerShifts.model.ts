import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
  } from 'kysely'
  


export interface VolunteerShiftsTable {
    id: number;               // Primary key
    event_id: number;          // Foreign key referencing the event
    volunteer_role: string;    // Volunteer role for the shift
    start: Date;               // Start time of the shift
    end: Date;                 // End time of the shift
  }

    // Define the types for Selectable, Insertable, and Updateable rows
    export type VolunteerRole = Selectable<VolunteerShiftsTable>
    export type NewVolunteerRole = Insertable<VolunteerShiftsTable>
    export type VolunteerRoleUpdate = Updateable<VolunteerShiftsTable>
    