import { create } from 'zustand';
import { postEventShifts, Shift, deleteShift, updateShift, getEventShifts, isOk, NewShift } from '@utils/fetch';
import { User } from 'firebase/auth';

interface VolunteerStore {
    shifts: Shift[];
    fetchShifts: (eventId: number, user: User) => void;
    fetchShift: (shiftId: number, user: User) => void;
    addShift: (eventId: number, newShifts: NewShift[], user: User) => void;  // Updated function signature
    updateShift: (shiftId: number, updatedShiftData: Shift, user: User) => void;
    deleteShift: (shiftId: number, user: User) => void;
}

export const useVolunteerShiftStore = create<VolunteerStore>((set) => ({
    shifts: [],
    fetchShifts: async (eventId: number, user: User) => {
        const response = await getEventShifts(eventId, user); // Requires both eventId and user
        if (isOk(response.status)) {
            set({ shifts: response.data });
        }
    },
    fetchShift: async (shiftId: number, user: User) => {
        const response = await getEventShifts(shiftId, user); // Assuming this method works for fetching single shifts
        if (isOk(response.status)) {
            const shift = response.data.find((shift: Shift) => shift.id === shiftId);
            if (shift) {
                set({ shifts: [shift] });
            }
        }
    },
    addShift: async (eventId: number, newShifts: NewShift[], user: User) => {
        const response = await postEventShifts(eventId, newShifts, user);  // Pass eventId, shifts, and user
        if (isOk(response.status)) {
            set(prev => ({ shifts: [...prev.shifts, ...response.data] }));
        }
    },
    updateShift: async (shiftId: number, updatedShiftData: Shift, user: User) => {
        const response = await updateShift(shiftId, updatedShiftData, user);
        if (isOk(response.status)) {
            set(prev => ({
                shifts: prev.shifts.map(shift =>
                    shift.id === shiftId ? { ...shift, ...updatedShiftData } : shift
                )
            }));
        } else {
            console.error("Failed to update shift:", response);
            alert('Failed to update shift. Please try again.');
        }
    },
    deleteShift: async (shiftId: number, user: User) => {
        const response = await deleteShift(shiftId, user);
        if (isOk(response.status)) {
            set(prev => ({ shifts: prev.shifts.filter(shift => shift.id !== shiftId) }));
        } else {
            console.error("Failed to delete shift:", response);
        }
    }
}));
