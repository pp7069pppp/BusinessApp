import { create } from "zustand";

export interface GasType {
  id: number;
  name: string;
  price: number;
  storeId: number;
}

export interface GasSale {
  id: number;
  gasReportId: number;
  gasTypeId: number;
  gallons: number;
  revenue: number;
  tankReading: number | null;
}

export interface HouseCharge {
  id: number;
  gasReportId: number;
  companyName: string;
  amount: number;
}

export interface GasReport {
  id: number;
  shiftId: number;
  storeId: number;
  totalGallons: number;
  totalRevenue: number;
  cash: number;
  dcrPayments: number;
  creditCards: number;
  totalHouseCharges: number;
  grandTotal: number;
  gasSales: GasSale[];
  houseCharges: HouseCharge[];
}

interface GasState {
  gasTypes: GasType[];
  gasReports: GasReport[];
  currentReport: GasReport | null;
  isLoading: boolean;
  error: string | null;
  fetchGasTypes: (storeId: number) => Promise<void>;
  fetchGasReport: (shiftId: number) => Promise<void>;
  createGasReport: (report: Omit<GasReport, "id">) => Promise<void>;
  updateGasReport: (report: GasReport) => Promise<void>;
  addGasSale: (sale: Omit<GasSale, "id">) => Promise<void>;
  addHouseCharge: (charge: Omit<HouseCharge, "id">) => Promise<void>;
  calculateTotals: (report: Partial<GasReport>) => {
    totalGallons: number;
    totalRevenue: number;
    grandTotal: number;
  };
}

// Mock data for development
const mockGasTypes: GasType[] = [
  {
    id: 1,
    name: "Regular",
    price: 3.499,
    storeId: 1,
  },
  {
    id: 2,
    name: "Premium",
    price: 3.999,
    storeId: 1,
  },
  {
    id: 3,
    name: "Diesel",
    price: 3.799,
    storeId: 1,
  },
];

const mockGasSales: GasSale[] = [
  {
    id: 1,
    gasReportId: 1,
    gasTypeId: 1,
    gallons: 250.5,
    revenue: 876.50,
    tankReading: 1250.75,
  },
  {
    id: 2,
    gasReportId: 1,
    gasTypeId: 2,
    gallons: 125.25,
    revenue: 500.87,
    tankReading: 875.5,
  },
];

const mockHouseCharges: HouseCharge[] = [
  {
    id: 1,
    gasReportId: 1,
    companyName: "City Fleet",
    amount: 150.75,
  },
];

const mockGasReports: GasReport[] = [
  {
    id: 1,
    shiftId: 1,
    storeId: 1,
    totalGallons: 375.75,
    totalRevenue: 1377.37,
    cash: 500.00,
    dcrPayments: 150.75,
    creditCards: 726.62,
    totalHouseCharges: 150.75,
    grandTotal: 1377.37,
    gasSales: mockGasSales,
    houseCharges: mockHouseCharges,
  },
];

export const useGasStore = create<GasState>((set, get) => ({
  gasTypes: [],
  gasReports: [],
  currentReport: null,
  isLoading: false,
  error: null,
  fetchGasTypes: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/stores/${storeId}/gas-types`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockGasTypes.filter(type => type.storeId === storeId);
      
      set({ gasTypes: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch gas types", isLoading: false });
    }
  },
  fetchGasReport: async (shiftId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/shifts/${shiftId}/gas-report`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockGasReports.find(report => report.shiftId === shiftId);
      
      if (data) {
        set({ currentReport: data, isLoading: false });
      } else {
        set({ currentReport: null, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch gas report", isLoading: false });
    }
  },
  createGasReport: async (report) => {
    set({ isLoading: true, error: null });
    try {
      // Calculate totals
      const { totalGallons, totalRevenue, grandTotal } = get().calculateTotals(report);
      
      // In a real app, this would be an API call
      // const response = await fetch(`/api/gas-reports`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({...report, totalGallons, totalRevenue, grandTotal}),
      // });
      // const newReport = await response.json();
      
      // Mock creating a new report
      const newReport = {
        ...report,
        totalGallons,
        totalRevenue,
        grandTotal,
        id: Math.max(0, ...get().gasReports.map(r => r.id)) + 1,
      };
      
      set(state => ({ 
        gasReports: [...state.gasReports, newReport],
        currentReport: newReport,
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to create gas report", isLoading: false });
    }
  },
  updateGasReport: async (report) => {
    set({ isLoading: true, error: null });
    try {
      // Calculate totals
      const { totalGallons, totalRevenue, grandTotal } = get().calculateTotals(report);
      const updatedReport = { ...report, totalGallons, totalRevenue, grandTotal };
      
      // In a real app, this would be an API call
      // await fetch(`/api/gas-reports/${report.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedReport),
      // });
      
      set(state => ({ 
        gasReports: state.gasReports.map(r => 
          r.id === report.id ? updatedReport : r
        ),
        currentReport: updatedReport,
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to update gas report", isLoading: false });
    }
  },
  addGasSale: async (sale) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/gas-sales`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(sale),
      // });
      // const newSale = await response.json();
      
      // Mock creating a new sale
      const newSale = {
        ...sale,
        id: Math.max(0, ...(get().currentReport?.gasSales || []).map(s => s.id)) + 1,
      };
      
      // Update the current report with the new sale
      const currentReport = get().currentReport;
      if (currentReport) {
        const updatedReport = {
          ...currentReport,
          gasSales: [...currentReport.gasSales, newSale],
        };
        get().updateGasReport(updatedReport);
      }
    } catch (error) {
      set({ error: "Failed to add gas sale", isLoading: false });
    }
  },
  addHouseCharge: async (charge) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/house-charges`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(charge),
      // });
      // const newCharge = await response.json();
      
      // Mock creating a new house charge
      const newCharge = {
        ...charge,
        id: Math.max(0, ...(get().currentReport?.houseCharges || []).map(c => c.id)) + 1,
      };
      
      // Update the current report with the new charge
      const currentReport = get().currentReport;
      if (currentReport) {
        const updatedReport = {
          ...currentReport,
          houseCharges: [...currentReport.houseCharges, newCharge],
          totalHouseCharges: currentReport.totalHouseCharges + newCharge.amount,
        };
        get().updateGasReport(updatedReport);
      }
    } catch (error) {
      set({ error: "Failed to add house charge", isLoading: false });
    }
  },
  calculateTotals: (report) => {
    const gasSales = report.gasSales || [];
    const totalGallons = gasSales.reduce((sum, sale) => sum + sale.gallons, 0);
    const totalRevenue = gasSales.reduce((sum, sale) => sum + sale.revenue, 0);
    const grandTotal = totalRevenue;
    
    return { totalGallons, totalRevenue, grandTotal };
  },
}));