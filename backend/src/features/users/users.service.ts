import { singleton } from "tsyringe";
import { DeleteResult, InsertResult, UpdateResult } from "kysely";
import { db } from "@database/database";
import { NewUser, Role, User } from "./users.model";

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

}
