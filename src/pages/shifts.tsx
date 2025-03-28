import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StoreSelector } from "@/components/ui/store-selector";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { format } from "date-fns";
import { CalendarPlus, FileEdit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ShiftsPage = () => {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts, createShift, isLoading } = useShiftStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newShift, setNewShift] = useState({
    shiftNumber: 1,
    shiftDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (currentStore) {
      fetchShifts(currentStore.id);
    }
  }, [currentStore, fetchShifts]);

  const handleCreateShift = () => {
    if (currentStore) {
      createShift({
        shiftNumber: parseInt(newShift.shiftNumber.toString()),
        shiftDate: new Date(newShift.shiftDate).toISOString(),
        storeId: currentStore.id,
      });
      setIsDialogOpen(false);
    }
  };

  const columns = [
    {
      header: "Shift #",
      accessorKey: "shiftNumber",
    },
    {
      header: "Date",
      accessorKey: "shiftDate",
      cell: (row) => format(new Date(row.shiftDate), "MMM dd, yyyy"),
    },
    {
      header: "Actions",
      accessorKey: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/business-report?shiftId=${row.id}`}>
              <FileEdit className="h-4 w-4 mr-1" />
              Report
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Shifts</h1>
          <StoreSelector />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Shift Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  <span>New Shift</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shiftNumber" className="text-right">
                      Shift #
                    </Label>
                    <Input
                      id="shiftNumber"
                      type="number"
                      value={newShift.shiftNumber}
                      onChange={(e) => setNewShift({ ...newShift, shiftNumber: parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shiftDate" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="shiftDate"
                      type="date"
                      value={newShift.shiftDate}
                      onChange={(e) => setNewShift({ ...newShift, shiftDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreateShift} disabled={!currentStore}>
                    Create Shift
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DataTable
              data={shifts}
              columns={columns}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ShiftsPage;