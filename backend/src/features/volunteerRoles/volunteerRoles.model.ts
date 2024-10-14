import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
  } from 'kysely'
  
  // Define the table structure for volunteer_roles
  export interface VolunteerRolesTable {
    id: Generated<number>
    name: string
  }
  
  // Define the types for Selectable, Insertable, and Updateable rows
  export type VolunteerRole = Selectable<VolunteerRolesTable>
  export type NewVolunteerRole = Insertable<VolunteerRolesTable>
  export type VolunteerRoleUpdate = Updateable<VolunteerRolesTable>
  