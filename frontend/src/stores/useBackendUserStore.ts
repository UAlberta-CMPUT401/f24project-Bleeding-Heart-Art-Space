import { BackendUserAndRole } from '@utils/fetch';
import { create } from 'zustand';

type BackendUserStore = {
    backendUser: BackendUserAndRole | null;
    setBackendUser: (backendUser: BackendUserAndRole) => void;
}

export const useBackendUserStore = create<BackendUserStore>((set) => ({
    backendUser: null,
    setBackendUser: async (backendUser: BackendUserAndRole) => {
        set({ backendUser: backendUser })
    },
}));
