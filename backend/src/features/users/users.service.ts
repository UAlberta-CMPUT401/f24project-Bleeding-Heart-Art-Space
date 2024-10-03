import { singleton } from "tsyringe";
import { DeleteResult, InsertResult, UpdateResult } from "kysely";
import { db } from "@database/database";

@singleton()
export class UsersService {
}
