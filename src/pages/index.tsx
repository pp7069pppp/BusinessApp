import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreSelector } from "@/components/ui/store-selector";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { Calendar, Fuel, Plus, Ticket } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

const Index = () => {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts } = useShiftStore();

  useEffect(() => {
    if (currentStore) {
      fetchShifts(currentStore.id);
    }
  }, [currentStore, fetchShifts]);

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <StoreSelector />
        </div>
        
        <DashboardSummary />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Shifts</CardTitle>
              <CardDescription>
                Manage your store shifts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground">
                {shifts.length} shifts recorded
              </div>
              <Button asChild className="w-full">
                <Link to="/shifts" className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Manage Shifts</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Lottery</CardTitle>
              <CardDescription>
                Manage lottery inventory and sales
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground">
                Scan tickets and manage inventory
              </div>
              <Button asChild className="w-full">
                <Link to="/lottery" className="flex items-center justify-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>Lottery Management</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gas Sales</CardTitle>
              <CardDescription>
                Track gas sales and house charges
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground">
                Record daily gas sales by type
              </div>
              <Button asChild className="w-full">
                <Link to="/gas" className="flex items-center justify-center gap-2">
                  <Fuel className="h-4 w-4" />
                  <span>Gas Sales</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button asChild>
            <Link to="/business-report" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Business Report</span>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;