import { BackendUser } from '@utils/fetch';
import { create } from 'zustand';

type BackendUserStore = {
    backendUser: BackendUser | null;
    setBackendUser: (backendUser: BackendUser) => void;
}

export const useBackendUserStore = create<BackendUserStore>((set) => ({
    backendUser: null,
    setBackendUser: async (backendUser: BackendUser) => {
        set({ backendUser: backendUser })
    },
}));
