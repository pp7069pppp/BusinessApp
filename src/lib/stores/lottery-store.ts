import { create } from "zustand";

export interface LotteryGame {
  id: number;
  gameNumber: string;
  gameName: string;
  costPerTicket: number;
  ticketsPerBook: number;
}

export interface LotteryBook {
  id: number;
  storeId: number;
  gameId: number;
  bookNumber: string;
  referenceNumber: string | null;
  startNumber: string;
  endNumber: string;
  status: 'available' | 'activated' | 'returned' | 'settled';
  game?: LotteryGame;
}

export interface ScannedTicket {
  id: number;
  storeId: number;
  shiftId: number;
  gameId: number;
  bookNumber: string;
  ticketNumber: string;
  gameName: string;
  gamePrice: number;
  totalTickets: number;
  status: 'scanned' | 'pending' | 'invalid';
  activatedOn: string;
  shiftStartTicket: string;
  currentTicket: string;
  quantitySold: number;
  total: number;
}

interface LotteryState {
  games: LotteryGame[];
  inventory: LotteryBook[];
  scannedTickets: ScannedTicket[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  fetchInventory: (storeId: number) => Promise<void>;
  fetchScannedTickets: (shiftId: number) => Promise<void>;
  activateBook: (bookId: number) => Promise<void>;
  scanTicket: (ticket: Omit<ScannedTicket, "id">) => Promise<void>;
  calculateLotterySales: (shiftId: number) => Promise<{
    todayOnlineNetSales: number;
    todayOnlineCashing: number;
    todayInstantCashing: number;
    totalOnlineBalance: number;
    overShort: number;
  }>;
}

// Mock data for development
const mockGames: LotteryGame[] = [
  {
    id: 1,
    gameNumber: "1234",
    gameName: "Lucky 7s",
    costPerTicket: 5,
    ticketsPerBook: 50,
  },
  {
    id: 2,
    gameNumber: "5678",
    gameName: "Gold Rush",
    costPerTicket: 10,
    ticketsPerBook: 25,
  },
];

const mockInventory: LotteryBook[] = [
  {
    id: 1,
    storeId: 1,
    gameId: 1,
    bookNumber: "123456",
    referenceNumber: "7",
    startNumber: "000",
    endNumber: "049",
    status: "available",
    game: mockGames[0],
  },
  {
    id: 2,
    storeId: 1,
    gameId: 2,
    bookNumber: "654321",
    referenceNumber: "8",
    startNumber: "000",
    endNumber: "024",
    status: "activated",
    game: mockGames[1],
  },
  {
    id: 3,
    storeId: 1,
    gameId: 1,
    bookNumber: "789012",
    referenceNumber: "9",
    startNumber: "000",
    endNumber: "049",
    status: "returned",
    game: mockGames[0],
  },
];

const mockScannedTickets: ScannedTicket[] = [
  {
    id: 1,
    storeId: 1,
    shiftId: 1,
    gameId: 2,
    bookNumber: "654321",
    ticketNumber: "010",
    gameName: "Gold Rush",
    gamePrice: 10,
    totalTickets: 25,
    status: "scanned",
    activatedOn: new Date().toISOString(),
    shiftStartTicket: "000",
    currentTicket: "010",
    quantitySold: 10,
    total: 100,
  },
];

export const useLotteryStore = create<LotteryState>((set, get) => ({
  games: [],
  inventory: [],
  scannedTickets: [],
  isLoading: false,
  error: null,
  fetchGames: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lottery/games');
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockGames;
      
      set({ games: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch lottery games", isLoading: false });
    }
  },
  fetchInventory: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/stores/${storeId}/lottery/inventory`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockInventory.filter(book => book.storeId === storeId);
      
      set({ inventory: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch lottery inventory", isLoading: false });
    }
  },
  fetchScannedTickets: async (shiftId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/shifts/${shiftId}/lottery/scanned-tickets`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockScannedTickets.filter(ticket => ticket.shiftId === shiftId);
      
      set({ scannedTickets: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch scanned tickets", isLoading: false });
    }
  },
  activateBook: async (bookId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/lottery/inventory/${bookId}/activate`, { method: 'POST' });
      
      // Update local state
      set(state => ({
        inventory: state.inventory.map(book => 
          book.id === bookId ? { ...book, status: 'activated' } : book
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to activate book", isLoading: false });
    }
  },
  scanTicket: async (ticket) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lottery/scan-ticket`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(ticket),
      // });
      // const newTicket = await response.json();
      
      // Mock creating a new scanned ticket
      const newTicket = {
        ...ticket,
        id: Math.max(0, ...get().scannedTickets.map(t => t.id)) + 1,
      };
      
      set(state => ({ 
        scannedTickets: [...state.scannedTickets, newTicket],
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to scan ticket", isLoading: false });
    }
  },
  calculateLotterySales: async (shiftId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/shifts/${shiftId}/lottery/calculations`);
      // const data = await response.json();
      
      // Mock calculations
      const tickets = get().scannedTickets.filter(t => t.shiftId === shiftId);
      const todayOnlineNetSales = 1250.75;
      const todayOnlineCashing = 875.50;
      const todayInstantCashing = tickets.reduce((sum, t) => sum + t.total, 0);
      const totalOnlineBalance = todayOnlineNetSales - todayOnlineCashing;
      const overShort = 0; // This would be calculated based on actual vs expected
      
      set({ isLoading: false });
      
      return {
        todayOnlineNetSales,
        todayOnlineCashing,
        todayInstantCashing,
        totalOnlineBalance,
        overShort,
      };
    } catch (error) {
      set({ error: "Failed to calculate lottery sales", isLoading: false });
      return {
        todayOnlineNetSales: 0,
        todayOnlineCashing: 0,
        todayInstantCashing: 0,
        totalOnlineBalance: 0,
        overShort: 0,
      };
    }
  },
}));