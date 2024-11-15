import { BackendUserAndRole, BatchAssignRole, getBackendUsersAndRole, getRoles, isOk, postAssignRoles, Role } from '@utils/fetch';
import { User } from 'firebase/auth';
import { create } from 'zustand';

type ManageUserStore = {
    users: BackendUserAndRole[];
    roles: Role[];
    fetchInit: (user: User) => void;
    assignRoles: (payload: BatchAssignRole, user: User) => void;
};

export const useManageUserStore = create<ManageUserStore>((set, get) => ({
    users: [],
    roles: [],
    fetchInit: async (user: User) => {
        const fetchUsers = async () => {
            const response = await getBackendUsersAndRole(user);
            if (isOk(response.status)) {
                set({ users: response.data });
            }
        }
        const fetchRoles = async () => {
            const response = await getRoles(user);
            if (isOk(response.status)) {
                set({ roles: response.data });
            }
        }
        await Promise.all([fetchUsers(), fetchRoles()]);
    },
    assignRoles: async (payload: BatchAssignRole, user: User) => {
        const role = get().roles.find(role => role.id === payload.role);
        if (role === undefined) {
            throw new Error("Role doesn't exist");
        }
        const response = await postAssignRoles(payload, user);
        if (isOk(response.status)) {
            set(prev => ({ users: prev.users.map(user => {
                if (response.data.includes(user.id)) {
                    return {
                        ...user,
                        role: role.id,
                        title: role.title,
                        can_take_shift: role.can_take_shift,
                        is_admin: role.is_admin,
                        is_blocked: role.is_blocked,
                    }
                } else {
                    return user;
                }
            })}));
        }
    }
}));
