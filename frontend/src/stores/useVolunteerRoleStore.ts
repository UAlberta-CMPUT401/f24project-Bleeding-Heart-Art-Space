import { getVolunteerRoles, isOk, NewVolunteerRole, postVolunteerRole, VolunteerRole } from '@utils/fetch';
import { User } from 'firebase/auth';
import { create } from 'zustand';

type VolunteerRoleStore = {
    volunteerRoles: VolunteerRole[];
    fetchVolunteerRoles: (user: User) => void;
    addVolunteerRole: (newVolunteerRole: NewVolunteerRole, user: User) => void;
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
}));
