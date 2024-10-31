import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { VolunteerRolesService } from './volunteerRoles.service';

export class VolunteerRolesController {
  public volunteerRolesService = container.resolve(VolunteerRolesService);

  public getAllVolunteerRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.volunteerRolesService.getAllVolunteerRoles();
      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  }

  public createVolunteerRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Role name is required' });
        return;
      }
      const insertedRole = await this.volunteerRolesService.createVolunteerRole({ name });
      if (insertedRole === undefined) {
        res.status(400)
        return;
      }
      res.status(201).json(insertedRole);
    } catch (error) {
      next(error);
    }
  }

  public deleteVolunteerRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Role ID is required' });
        return;
      }

      // Delete associated shifts first
      await this.volunteerRolesService.deleteShiftsByRoleId(Number(id));

      // Then delete the role
      await this.volunteerRolesService.deleteVolunteerRole(Number(id));
      res.status(200).json({ message: 'Volunteer role and associated shifts deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
