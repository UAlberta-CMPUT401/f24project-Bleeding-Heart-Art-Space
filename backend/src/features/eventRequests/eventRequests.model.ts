import {
  Generated,
  Selectable,
  Insertable,
  Updateable,
  ColumnType,
} from 'kysely';

export interface EventRequestsTable {
  id: Generated<number>;                // Auto-generated ID
  start: ColumnType<Date, string, Date>; // Event start date and time
  end: ColumnType<Date, string, Date>;   // Event end date and time
  venue: string;                         // Venue for the event
  address: string;                       // Address of the event
  title: string;                         // Title of the event
  requester_id: number;                    // ID of the requester
}

export type EventRequest = Selectable<EventRequestsTable>;       // Type for selecting (reading) event records
export type NewEventRequest = Insertable<EventRequestsTable>;    // Type for inserting a new event record
export type EventRequestUpdate = Updateable<EventRequestsTable>; // Type for updating an existing event record
