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
}

// Define the types for various operations on the EventsTable
export type Event = Selectable<EventsTable>;       // Type for selecting (reading) event records
export type NewEvent = Insertable<EventsTable>;    // Type for inserting a new event record
export type EventUpdate = Updateable<EventsTable>; // Type for updating an existing event record
