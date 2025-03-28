import { create } from "zustand";

export interface BusinessReport {
  id: number;
  shiftId: number;
  storeId: number;
  netSalesRegister: number;
  netTaxes: number;
  mealTax: number;
  refund: number;
  cheque: number;
  creditCard: number;
  registerCash: number;
  overShort: number;
  cashToAccount: number;
  // Add new fields
  customerCredits?: number;
  customerDebits?: number;
  gasSales?: number;
  notes?: string;
  // Lottery properties
  lotteryTodayOnlineNetSales?: number;
  lotteryYesterdayOnlineNetSales?: number;
  lotteryTodayOnlineCashing?: number;
  lotteryYesterdayOnlineCashing?: number;
  lotteryTodayInstantCashing?: number;
  lotteryYesterdayInstantCashing?: number;
  lotteryTodayInstantSale?: number;
  lotteryYesterdayInstantSale?: number;
  lotteryCredits?: number;
  lotteryDebits?: number;
  lotteryOnlineBalance?: number;
  lotteryInstantBalance?: number;
  lotteryTotalBalance?: number;
  lotteryRegisterCash?: number;
  lotteryOverShort?: number;
}

interface BusinessReportState {
  businessReports: BusinessReport[];
  currentReport: BusinessReport | null;
  isLoading: boolean;
  error: string | null;
  fetchBusinessReport: (shiftId: number) => Promise<void>;
  createBusinessReport: (report: Omit<BusinessReport, "id">) => Promise<void>;
  updateBusinessReport: (report: BusinessReport) => Promise<void>;
  calculateOverShort: (report: Partial<BusinessReport>) => number;
  calculateCashToAccount: (report: Partial<BusinessReport>) => number;
}

// Mock data for development
const mockReports: BusinessReport[] = [
  {
    id: 1,
    shiftId: 1,
    storeId: 1,
    netSalesRegister: 2500.75,
    netTaxes: 187.56,
    mealTax: 45.25,
    refund: 25.00,
    cheque: 150.00,
    creditCard: 1850.50,
    registerCash: 708.06,
    overShort: 0,
    cashToAccount: 708.06,
    customerCredits: 50.00,
    customerDebits: 25.00,
    gasSales: 1250.00,
    notes: "Everything balanced today.",
    lotteryTodayOnlineNetSales: 1250.75,
    lotteryYesterdayOnlineNetSales: 1150.25,
    lotteryTodayOnlineCashing: 875.50,
    lotteryYesterdayOnlineCashing: 750.25,
    lotteryTodayInstantCashing: 325.00,
    lotteryYesterdayInstantCashing: 275.50,
    lotteryTodayInstantSale: 450.00,
    lotteryYesterdayInstantSale: 425.00,
    lotteryCredits: 50.00,
    lotteryDebits: 25.00,
    lotteryOnlineBalance: 375.25,
    lotteryInstantBalance: 125.00,
    lotteryTotalBalance: 525.25,
    lotteryRegisterCash: 525.25,
    lotteryOverShort: 0,
  },
];

export const useBusinessReportStore = create<BusinessReportState>((set, get) => ({
  businessReports: [],
  currentReport: null,
  isLoading: false,
  error: null,
  fetchBusinessReport: async (shiftId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/shifts/${shiftId}/business-report`);
      // const data = await response.json();
      
      // Using mock data for now
      const data = mockReports.find(report => report.shiftId === shiftId);
      
      if (data) {
        set({ currentReport: data, isLoading: false });
      } else {
        set({ currentReport: null, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch business report", isLoading: false });
    }
  },
  createBusinessReport: async (report) => {
    set({ isLoading: true, error: null });
    try {
      // Calculate derived values
      const overShort = get().calculateOverShort(report);
      const cashToAccount = get().calculateCashToAccount(report);
      
      // In a real app, this would be an API call
      // const response = await fetch(`/api/business-reports`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({...report, overShort, cashToAccount}),
      // });
      // const newReport = await response.json();
      
      // Mock creating a new report
      const newReport = {
        ...report,
        overShort,
        cashToAccount,
        id: Math.max(0, ...get().businessReports.map(r => r.id)) + 1,
      };
      
      set(state => ({ 
        businessReports: [...state.businessReports, newReport],
        currentReport: newReport,
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to create business report", isLoading: false });
    }
  },
  updateBusinessReport: async (report) => {
    set({ isLoading: true, error: null });
    try {
      // Calculate derived values
      const overShort = get().calculateOverShort(report);
      const cashToAccount = get().calculateCashToAccount(report);
      const updatedReport = { ...report, overShort, cashToAccount };
      
      // In a real app, this would be an API call
      // await fetch(`/api/business-reports/${report.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedReport),
      // });
      
      set(state => ({ 
        businessReports: state.businessReports.map(r => 
          r.id === report.id ? updatedReport : r
        ),
        currentReport: updatedReport,
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to update business report", isLoading: false });
    }
  },
  calculateOverShort: (report) => {
    if (!report.netSalesRegister || !report.creditCard || !report.cheque || !report.registerCash) {
      return 0;
    }
    
    const totalSales = report.netSalesRegister;
    const totalCollected = report.creditCard + report.cheque + report.registerCash;
    
    return +(totalCollected - totalSales).toFixed(2);
  },
  calculateCashToAccount: (report) => {
    if (!report.registerCash) return 0;
    return +report.registerCash.toFixed(2);
  },
}));