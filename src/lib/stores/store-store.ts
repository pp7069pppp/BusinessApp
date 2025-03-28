import { create } from "zustand";

export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  isLoading: boolean;
  error: string | null;
  fetchStores: () => Promise<void>;
  setCurrentStore: (storeId: number) => void;
}

// Mock data for development
const mockStores: Store[] = [
  {
    id: 1,
    name: "Main Street Store",
    address: "123 Main St, Anytown, USA",
    phone: "555-123-4567",
    email: "main@example.com",
  },
  {
    id: 2,
    name: "Downtown Location",
    address: "456 Center Ave, Anytown, USA",
    phone: "555-987-6543",
    email: "downtown@example.com",
  },
];

export const useStoreStore = create<StoreState>((set) => ({
  stores: [],
  currentStore: null,
  isLoading: false,
  error: null,
  fetchStores: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/stores');
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockStores;
      
      set({ stores: data, isLoading: false });
      
      // Set first store as current if none selected
      if (data.length > 0 && !useStoreStore.getState().currentStore) {
        set({ currentStore: data[0] });
      }
    } catch (error) {
      set({ error: "Failed to fetch stores", isLoading: false });
    }
  },
  setCurrentStore: (storeId) => {
    const store = useStoreStore.getState().stores.find(s => s.id === storeId);
    if (store) {
      set({ currentStore: store });
    }
  },
}));