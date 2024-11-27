import { BackendUserAndRole } from '@utils/fetch';
import { create } from 'zustand';

type BackendUserStore = {
    backendUser: BackendUserAndRole | null;
    userAdminEvents: Set<number>;
    setBackendUser: (backendUser: BackendUserAndRole) => void;
    setUserAdminEvents: (eventIds: number[]) => void;
}

export const useBackendUserStore = create<BackendUserStore>((set) => ({
    backendUser: null,
    userAdminEvents: new Set(),
    setBackendUser: async (backendUser: BackendUserAndRole) => {
        set({ backendUser: backendUser });
    },
    setUserAdminEvents: async (eventIds: number[]) => {
        set({ userAdminEvents: new Set(eventIds) });
    },
}));
