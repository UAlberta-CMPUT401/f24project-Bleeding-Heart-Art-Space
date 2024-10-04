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

  public async getRole(user: User): Promise<Role | undefined> {
    return await db
      .selectFrom('roles')
      .where('id', '=', user.role)
      .selectAll()
      .executeTakeFirst();
  }

}
