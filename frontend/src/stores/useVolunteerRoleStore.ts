import { deleteVolunteerRoles, getVolunteerRoles, isOk, NewVolunteerRole, postVolunteerRole, VolunteerRole } from '@utils/fetch';
import { User } from 'firebase/auth';
import { create } from 'zustand';

type VolunteerRoleStore = {
    volunteerRoles: VolunteerRole[];
    fetchVolunteerRoles: (user: User) => void;
    addVolunteerRole: (newVolunteerRole: NewVolunteerRole, user: User) => void;
    deleteVolunteerRoles: (volunteerRoles: VolunteerRole[], user: User) => void;
}

export const useVolunteerRoleStore = create<VolunteerRoleStore>((set) => ({
    volunteerRoles: [],
    fetchVolunteerRoles: async (user: User) => {
        const response = await getVolunteerRoles(user);
        if (isOk(response.status)) {
            set({ volunteerRoles: response.data });
        }
    },
    addVolunteerRole: async (newVolunteerRole: NewVolunteerRole, user: User) => {
        const response = await postVolunteerRole(newVolunteerRole, user)
        if (isOk(response.status)) {
            set(prev => ({ volunteerRoles: [...prev.volunteerRoles, response.data] }));
        }
    },
    deleteVolunteerRoles: async (volunteerRoles: VolunteerRole[], user: User) => {
        const response = await deleteVolunteerRoles(volunteerRoles, user);
        if (isOk(response.status)) {
            set(prev => ({ volunteerRoles: prev.volunteerRoles.filter(volunteerRole => !response.data.includes(volunteerRole.id)) }));
        }
    }
}));
