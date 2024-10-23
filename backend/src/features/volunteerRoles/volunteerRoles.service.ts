import { singleton } from 'tsyringe';
import { DeleteResult, InsertResult } from 'kysely';
import { db } from '@database/database';
import { NewVolunteerRole, VolunteerRole } from './volunteerRoles.model';

@singleton()
export class VolunteerRolesService {

  public async getAllVolunteerRoles(): Promise<VolunteerRole[]> {
    return await db
      .selectFrom('volunteer_roles')
      .selectAll()
      .execute();
  }

  public async createVolunteerRole(newVolunteerRole: NewVolunteerRole): Promise<InsertResult> {
    return await db
      .insertInto('volunteer_roles')
      .values(newVolunteerRole)
      .executeTakeFirst();
  }

  public async deleteVolunteerRole(id: number): Promise<DeleteResult> {
    return await db
      .deleteFrom('volunteer_roles')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async deleteShiftsByRoleId(id: number): Promise<DeleteResult> {
    return await db
      .deleteFrom('volunteer_shifts' as any)
      .where('volunteer_role', '=', id)
      .executeTakeFirst();
  }

}