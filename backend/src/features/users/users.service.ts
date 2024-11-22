import { singleton } from "tsyringe";
import { DeleteResult, InsertResult, UpdateResult } from "kysely";
import { db } from "@database/database";
import { NewUser, Role, User } from "./users.model";

type UserAndRole = {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: number | null;
  title: string | null;
  can_take_shift: boolean | null;
  can_request_event: boolean | null;
  is_admin: boolean | null;
  is_blocked: boolean | null;
  total_hours?: number;
};

@singleton()
export class UsersService {

  public async getUser(uid: string): Promise<User | undefined> {
    return await db
      .selectFrom('users')
      .where('uid', '=', uid)
      .selectAll()
      .executeTakeFirst();
  }
  
  public async createVolunteer(newUser: NewUser): Promise<InsertResult> {
    return await db
      .insertInto('users')
      .values((eb) => ({
        ...newUser,
        role: eb.selectFrom('roles').where('roles.title', '=', 'volunteer').select('roles.id').limit(1),
      }))
      .executeTakeFirst();
  }

  public async getUserRole(user: User): Promise<Role | undefined> {
    return await db
      .selectFrom('roles')
      .where('id', '=', user.role)
      .selectAll()
      .executeTakeFirst();
  }

  public async setUserRole(user: User, roleTitle: string): Promise<UpdateResult> {
    return await db
      .updateTable('users')
      .set((eb) => ({
        role: eb.selectFrom('roles').where('roles.title', '=', roleTitle).select('roles.id').limit(1),
      }))
      .where('id', '=', user.id)
      .executeTakeFirst();
  }

  public async getUserAndRole(uid: string): Promise<UserAndRole | undefined> {
    const userAndRole = await db
      .selectFrom('roles')
      .rightJoin(
        (eb) => eb
          .selectFrom('users')
          .selectAll()
          .where('uid', '=', uid)
          .as('users'),
        (join) => join
          .onRef('users.role', '=', 'roles.id')
      )
      .select([
        'users.id',
        'users.uid',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.phone',
        'users.role',
        'roles.title',
        'roles.can_take_shift',
        'roles.can_request_event',
        'roles.is_admin',
        'roles.is_blocked',
      ])
      .executeTakeFirst();

    return userAndRole;
  }

  public async getUsersAndRole(): Promise<UserAndRole[]> {
    const userAndRole = await db
      .selectFrom('users')
      .leftJoin('roles', 'roles.id', 'users.role')
      .leftJoin(
        db
          .selectFrom('shift_signup')
          .select(['user_id'])
          .select((eb) => eb.fn.sum('hours_worked').as('total_hours'))
          .groupBy('user_id')
          .as('user_hours'),
        'users.id',
        'user_hours.user_id'
      )
      .select([
        'users.id',
        'users.uid',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.phone',
        'users.role',
        'roles.title',
        'roles.can_take_shift',
        'roles.can_request_event',
        'roles.is_admin',
        'roles.is_blocked',
        'user_hours.total_hours',
      ])
      .execute();
  
    return userAndRole.map(user => ({
      ...user,
      total_hours: Number(user.total_hours ?? 0),
    }));
  }

  public async batchAssignRole(users: number[], role: number, uid: string): Promise<number[]> {
    // modify list of users to remove admins (but including caller so caller can demote themselves from admin)
    const notAdmins = await db
      .selectFrom('users')
      .leftJoin('roles', 'roles.id', 'users.role')
      .select('users.id')
      .where(eb => eb.and([
        eb('users.id', 'in', users),
        eb.or([
          eb('is_admin', '=', false),
          eb('uid', '=', uid),
        ]),
      ]))
      .execute();

    if (notAdmins.length === 0) return [];

    const updatedIds = await db
      .updateTable('users')
      .set({
        role: role,
      })
      .where('id', 'in', notAdmins.map(user => user.id))
      .returning('id')
      .execute();

    return updatedIds.map(id => id.id);
  }

  public async getRoles(): Promise<Role[]> {
    return await db
      .selectFrom('roles')
      .selectAll()
      .execute();
  }

  public async updateUser(uid: string, data: { first_name: string; last_name: string; phone: string | null }): Promise<UpdateResult> {
    return await db
      .updateTable('users')
      .set(data)
      .where('uid', '=', uid)
      .executeTakeFirst();
  }  
}
