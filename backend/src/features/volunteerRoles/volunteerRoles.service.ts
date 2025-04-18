import { singleton } from 'tsyringe';
import { DeleteResult } from 'kysely';
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

  public async createVolunteerRole(newVolunteerRole: NewVolunteerRole): Promise<VolunteerRole | undefined> {
    const insertedVolunteerRole = await db
      .insertInto('volunteer_roles')
      .values(newVolunteerRole)
      .returningAll()
      .executeTakeFirst();

    return insertedVolunteerRole;
  }

  public async deleteVolunteerRole(id: number): Promise<DeleteResult> {
    return await db
      .deleteFrom('volunteer_roles')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async deleteVolunteerRoles(ids: number[]): Promise<number[]> {
    const deletedIds = await db
      .deleteFrom('volunteer_roles')
      .where('id', 'in', ids)
      .returning('id')
      .execute();
    return deletedIds.map(id => id.id);
  }

}
