import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely'

export interface UsersTable {
  id: Generated<number>
  uid: string
  first_name: string
  last_name: string
  email: string
  role: number
}

export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export interface RolesTable {
  id: Generated<number>
  title: string
}
