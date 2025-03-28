import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StoreSelector } from "@/components/ui/store-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBusinessReportStore } from "@/lib/stores/business-report-store";
import { useGasStore } from "@/lib/stores/gas-store";
import { useLotteryStore } from "@/lib/stores/lottery-store";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { format } from "date-fns";
import { Download, FileText } from "lucide-react";
import { useEffect } from "react";

const ReportsPage = () => {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts } = useShiftStore();
  const { businessReports } = useBusinessReportStore();
  const { gasReports } = useGasStore();

  useEffect(() => {
    if (currentStore) {
      fetchShifts(currentStore.id);
    }
  }, [currentStore, fetchShifts]);

  const businessReportColumns = [
    {
      header: "Date",
      accessorKey: (row) => {
        const shift = shifts.find(s => s.id === row.shiftId);
        return shift ? format(new Date(shift.shiftDate), "MMM dd, yyyy") : "Unknown";
      },
    },
    {
      header: "Shift #",
      accessorKey: (row) => {
        const shift = shifts.find(s => s.id === row.shiftId);
        return shift ? shift.shiftNumber : "Unknown";
      },
    },
    {
      header: "Net Sales",
      accessorKey: "netSalesRegister",
      cell: (row) => `$${row.netSalesRegister.toFixed(2)}`,
    },
    {
      header: "Cash to Account",
      accessorKey: "cashToAccount",
      cell: (row) => `$${row.cashToAccount.toFixed(2)}`,
    },
    {
      header: "Over/Short",
      accessorKey: "overShort",
      cell: (row) => `$${row.overShort.toFixed(2)}`,
    },
    {
      header: "Actions",
      accessorKey: (row) => (
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          <span>Export</span>
        </Button>
      ),
    },
  ];

  const gasReportColumns = [
    {
      header: "Date",
      accessorKey: (row) => {
        const shift = shifts.find(s => s.id === row.shiftId);
        return shift ? format(new Date(shift.shiftDate), "MMM dd, yyyy") : "Unknown";
      },
    },
    {
      header: "Shift #",
      accessorKey: (row) => {
        const shift = shifts.find(s => s.id === row.shiftId);
        return shift ? shift.shiftNumber : "Unknown";
      },
    },
    {
      header: "Gallons",
      accessorKey: "totalGallons",
      cell: (row) => row.totalGallons.toFixed(2),
    },
    {
      header: "Revenue",
      accessorKey: "totalRevenue",
      cell: (row) => `$${row.totalRevenue.toFixed(2)}`,
    },
    {
      header: "House Charges",
      accessorKey: "totalHouseCharges",
      cell: (row) => `$${row.totalHouseCharges.toFixed(2)}`,
    },
    {
      header: "Actions",
      accessorKey: (row) => (
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          <span>Export</span>
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <StoreSelector />
        </div>

        <Tabs defaultValue="business">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">Business Reports</TabsTrigger>
            <TabsTrigger value="gas">Gas Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Business Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={businessReports}
                  columns={businessReportColumns}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gas Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={gasReports}
                  columns={gasReportColumns}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportsPage;