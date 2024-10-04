import { singleton } from "tsyringe";
import { DeleteResult, InsertResult, sql, UpdateResult } from "kysely";
import { db } from "@database/database";
import { Role, User } from "./users.model";

@singleton()
export class UsersService {

  public async getUser(uid: string): Promise<User | undefined> {
    return await db
      .selectFrom('users')
      .where('uid', '=', uid)
      .selectAll()
      .executeTakeFirst();
  }

  public async getUserAndRole(uid: string) {
    return await db
      .selectFrom('users')
      .where('uid', '=', uid)
      .innerJoin('roles', 'users.role', 'roles.id')
      .selectAll('users')
      .selectAll('roles')
      .select((eb) => [
        eb.ref('roles.id').as('role_id')
      ])
      .executeTakeFirst();
  }

}
