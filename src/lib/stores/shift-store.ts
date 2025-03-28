import { create } from "zustand";

export interface Shift {
  id: number;
  shiftNumber: number;
  shiftDate: string;
  storeId: number;
}

interface ShiftState {
  shifts: Shift[];
  currentShift: Shift | null;
  isLoading: boolean;
  error: string | null;
  fetchShifts: (storeId: number) => Promise<void>;
  createShift: (shift: Omit<Shift, "id">) => Promise<void>;
  setCurrentShift: (shiftId: number) => void;
}

// Mock data for development
const mockShifts: Shift[] = [
  {
    id: 1,
    shiftNumber: 1,
    shiftDate: new Date().toISOString(),
    storeId: 1,
  },
  {
    id: 2,
    shiftNumber: 2,
    shiftDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    storeId: 1,
  },
];

export const useShiftStore = create<ShiftState>((set, get) => ({
  shifts: [],
  currentShift: null,
  isLoading: false,
  error: null,
  fetchShifts: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/stores/${storeId}/shifts`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockShifts.filter(shift => shift.storeId === storeId);
      
      set({ shifts: data, isLoading: false });
      
      // Set most recent shift as current if none selected
      if (data.length > 0 && !get().currentShift) {
        const sortedShifts = [...data].sort((a, b) => 
          new Date(b.shiftDate).getTime() - new Date(a.shiftDate).getTime()
        );
        set({ currentShift: sortedShifts[0] });
      }
    } catch (error) {
      set({ error: "Failed to fetch shifts", isLoading: false });
    }
  },
  createShift: async (shift) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/shifts`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(shift),
      // });
      // const newShift = await response.json();
      
      // Mock creating a new shift
      const newShift = {
        ...shift,
        id: Math.max(0, ...get().shifts.map(s => s.id)) + 1,
      };
      
      set(state => ({ 
        shifts: [...state.shifts, newShift],
        currentShift: newShift,
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to create shift", isLoading: false });
    }
  },
  setCurrentShift: (shiftId) => {
    const shift = get().shifts.find(s => s.id === shiftId);
    if (shift) {
      set({ currentShift: shift });
    }
  },
}));