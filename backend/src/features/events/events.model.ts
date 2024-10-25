import {
  Generated,
  Selectable,
  Insertable,
  Updateable,
  ColumnType,
} from 'kysely';

export interface EventsTable {
  id: Generated<number>;                // Auto-generated ID
  start: ColumnType<Date, string, Date>; // Event start date and time
  end: ColumnType<Date, string, Date>;   // Event end date and time
  venue: string;                         // Venue for the event
  address: string;                       // Address of the event
  title: string;                         // Title of the event
  
  // number_of_artists: number;             // Number of artists for the event
  // number_of_volunteers: number;          // Number of volunteers for the event
  // volunteer_roles: string[];             // Volunteer roles (array of strings stored as JSON)
  // date: ColumnType<Date, string, Date>;  // Date of the event
}

export interface EventRequestsTable {
  id: Generated<number>;                // Auto-generated ID
  start: ColumnType<Date, string, Date>; // Event start date and time
  end: ColumnType<Date, string, Date>;   // Event end date and time
  venue: string;                         // Venue for the event
  address: string;                       // Address of the event
  title: string;                         // Title of the event
  requester: number;
}

// Define the types for various operations on the EventsTable
export type Event = Selectable<EventsTable>;       // Type for selecting (reading) event records
export type NewEvent = Insertable<EventsTable>;    // Type for inserting a new event record
export type EventUpdate = Updateable<EventsTable>; // Type for updating an existing event record

export type EventRequest = Selectable<EventRequestsTable>;       // Type for selecting (reading) event records
export type NewEventRequest = Insertable<EventRequestsTable>;    // Type for inserting a new event record
export type EventRequestUpdate = Updateable<EventRequestsTable>; // Type for updating an existing event record
