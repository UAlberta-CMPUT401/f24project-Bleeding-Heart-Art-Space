import {
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'

export interface UsersTable {
  id: Generated<number>
  uid: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: number | null
}

export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export interface RolesTable {
  id: Generated<number>
  title: string
  can_take_shift: boolean
  can_request_event: boolean
  is_admin: boolean
  is_blocked: boolean
}

export type Role = Selectable<RolesTable>
export type NewRole = Insertable<RolesTable>
export type RoleUpdate = Updateable<RolesTable>

export interface UserEventRolesTable {
  user_id: number
  event_id: number
  role_id: number
}
export type UserEventRoles = Selectable<UserEventRolesTable>
export type NewUserEventRoles = Insertable<UserEventRolesTable>
export type UserEventRolesUpdate = Updateable<UserEventRolesTable>
