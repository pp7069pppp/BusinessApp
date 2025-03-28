import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessReportStore } from "@/lib/stores/business-report-store";
import { useGasStore } from "@/lib/stores/gas-store";
import { useLotteryStore } from "@/lib/stores/lottery-store";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { BarChart3, Calculator, Fuel, Ticket } from "lucide-react";
import { useEffect } from "react";

export function DashboardSummary() {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts } = useShiftStore();
  const { currentReport, fetchBusinessReport } = useBusinessReportStore();
  const { calculateLotterySales } = useLotteryStore();
  const { fetchGasReport, currentReport: gasReport } = useGasStore();

  useEffect(() => {
    if (currentStore) {
      fetchShifts(currentStore.id);
    }
  }, [currentStore, fetchShifts]);

  useEffect(() => {
    if (shifts.length > 0) {
      const latestShift = shifts[0];
      fetchBusinessReport(latestShift.id);
      fetchGasReport(latestShift.id);
    }
  }, [shifts, fetchBusinessReport, fetchGasReport]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Register Sales
          </CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${currentReport?.netSalesRegister.toFixed(2) || "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">
            Latest shift total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cash to Account
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${currentReport?.cashToAccount.toFixed(2) || "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">
            Latest shift deposit
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lottery Sales
          </CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${currentReport?.lotteryTodayOnlineNetSales?.toFixed(2) || "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">
            Today's online sales
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Gas Revenue
          </CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${gasReport?.totalRevenue.toFixed(2) || "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">
            {gasReport?.totalGallons.toFixed(1) || "0.0"} gallons sold
          </p>
        </CardContent>
      </Card>
    </div>
  );
}