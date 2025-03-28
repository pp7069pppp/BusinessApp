import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreSelector } from "@/components/ui/store-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGasStore } from "@/lib/stores/gas-store";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { format } from "date-fns";
import { Fuel, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GasPage = () => {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts, currentShift, setCurrentShift } = useShiftStore();
  const {
    gasTypes,
    currentReport,
    fetchGasTypes,
    fetchGasReport,
    createGasReport,
    updateGasReport,
    addGasSale,
    addHouseCharge,
    isLoading,
  } = useGasStore();

  const [newSale, setNewSale] = useState({
    gasTypeId: "",
    gallons: 0,
    revenue: 0,
    tankReading: 0,
  });

  const [newCharge, setNewCharge] = useState({
    companyName: "",
    amount: 0,
  });

  useEffect(() => {
    if (currentStore) {
      fetchShifts(currentStore.id);
      fetchGasTypes(currentStore.id);
    }
  }, [currentStore, fetchShifts, fetchGasTypes]);

  useEffect(() => {
    if (currentShift) {
      fetchGasReport(currentShift.id);
    }
  }, [currentShift, fetchGasReport]);

  const handleAddSale = () => {
    if (!currentStore || !currentShift || !currentReport) {
      toast.error("Please select a store and shift");
      return;
    }

    if (!newSale.gasTypeId) {
      toast.error("Please select a gas type");
      return;
    }

    addGasSale({
      gasReportId: currentReport.id,
      gasTypeId: parseInt(newSale.gasTypeId),
      gallons: newSale.gallons,
      revenue: newSale.revenue,
      tankReading: newSale.tankReading || null,
    });

    toast.success("Gas sale added successfully");
    setNewSale({
      gasTypeId: "",
      gallons: 0,
      revenue: 0,
      tankReading: 0,
    });
  };

  const handleAddCharge = () => {
    if (!currentStore || !currentShift || !currentReport) {
      toast.error("Please select a store and shift");
      return;
    }

    if (!newCharge.companyName) {
      toast.error("Please enter a company name");
      return;
    }

    addHouseCharge({
      gasReportId: currentReport.id,
      companyName: newCharge.companyName,
      amount: newCharge.amount,
    });

    toast.success("House charge added successfully");
    setNewCharge({
      companyName: "",
      amount: 0,
    });
  };

  const handleCreateReport = () => {
    if (!currentStore || !currentShift) {
      toast.error("Please select a store and shift");
      return;
    }

    createGasReport({
      shiftId: currentShift.id,
      storeId: currentStore.id,
      totalGallons: 0,
      totalRevenue: 0,
      cash: 0,
      dcrPayments: 0,
      creditCards: 0,
      totalHouseCharges: 0,
      grandTotal: 0,
      gasSales: [],
      houseCharges: [],
    });

    toast.success("Gas report created successfully");
  };

  const salesColumns = [
    {
      header: "Gas Type",
      accessorKey: (row) => {
        const type = gasTypes.find(t => t.id === row.gasTypeId);
        return type ? type.name : "Unknown";
      },
    },
    {
      header: "Gallons",
      accessorKey: "gallons",
      cell: (row) => row.gallons.toFixed(2),
    },
    {
      header: "Revenue",
      accessorKey: "revenue",
      cell: (row) => `$${row.revenue.toFixed(2)}`,
    },
    {
      header: "Tank Reading",
      accessorKey: "tankReading",
      cell: (row) => row.tankReading ? row.tankReading.toFixed(2) : "N/A",
    },
  ];

  const chargesColumns = [
    {
      header: "Company",
      accessorKey: "companyName",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => `$${row.amount.toFixed(2)}`,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gas Sales</h1>
          <StoreSelector />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Shift:</span>
            {currentShift ? (
              <span>
                #{currentShift.shiftNumber} - {format(new Date(currentShift.shiftDate), "MMM dd, yyyy")}
              </span>
            ) : (
              <span className="text-muted-foreground">No shift selected</span>
            )}
          </div>
          
          {!currentReport && currentShift && (
            <Button onClick={handleCreateReport} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Gas Report</span>
            </Button>
          )}
        </div>

        {currentReport ? (
          <Tabs defaultValue="sales">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sales">Gas Sales</TabsTrigger>
              <TabsTrigger value="charges">House Charges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5" />
                    Gas Sales
                  </CardTitle>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Sale</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Gas Sale</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="gasType" className="text-right">
                            Gas Type
                          </Label>
                          <Select
                            value={newSale.gasTypeId}
                            onValueChange={(value) => setNewSale({ ...newSale, gasTypeId: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select gas type" />
                            </SelectTrigger>
                            <SelectContent>
                              {gasTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                  {type.name} - ${type.price.toFixed(3)}/gal
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="gallons" className="text-right">
                            Gallons
                          </Label>
                          <Input
                            id="gallons"
                            type="number"
                            step="0.01"
                            value={newSale.gallons}
                            onChange={(e) => setNewSale({ ...newSale, gallons: parseFloat(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="revenue" className="text-right">
                            Revenue
                          </Label>
                          <Input
                            id="revenue"
                            type="number"
                            step="0.01"
                            value={newSale.revenue}
                            onChange={(e) => setNewSale({ ...newSale, revenue: parseFloat(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="tankReading" className="text-right">
                Tank Reading
                          </Label>
                          <Input
                            id="tankReading"
                            type="number"
                            step="0.01"
                            value={newSale.tankReading}
                            onChange={(e) => setNewSale({ ...newSale, tankReading: parseFloat(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddSale}>
                          Add Sale
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={currentReport.gasSales}
                    columns={salesColumns}
                    isLoading={isLoading}
                  />
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Gallons</Label>
                      <div className="rounded-md border p-2">
                        {currentReport.totalGallons.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Revenue</Label>
                      <div className="rounded-md border p-2">
                        ${currentReport.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="charges">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>House Charges</CardTitle>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Charge</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add House Charge</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="companyName" className="text-right">
                            Company
                          </Label>
                          <Input
                            id="companyName"
                            value={newCharge.companyName}
                            onChange={(e) => setNewCharge({ ...newCharge, companyName: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={newCharge.amount}
                            onChange={(e) => setNewCharge({ ...newCharge, amount: parseFloat(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddCharge}>
                          Add Charge
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={currentReport.houseCharges}
                    columns={chargesColumns}
                    isLoading={isLoading}
                  />
                  
                  <div className="mt-6 space-y-2">
                    <Label>Total House Charges</Label>
                    <div className="rounded-md border p-2">
                      ${currentReport.totalHouseCharges.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="cash">Cash</Label>
                      <Input
                        id="cash"
                        type="number"
                        step="0.01"
                        value={currentReport.cash}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          updateGasReport({
                            ...currentReport,
                            cash: value,
                          });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dcrPayments">DCR Payments</Label>
                      <Input
                        id="dcrPayments"
                        type="number"
                        step="0.01"
                        value={currentReport.dcrPayments}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          updateGasReport({
                            ...currentReport,
                            dcrPayments: value,
                          });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creditCards">Credit Cards</Label>
                      <Input
                        id="creditCards"
                        type="number"
                        step="0.01"
                        value={currentReport.creditCards}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          updateGasReport({
                            ...currentReport,
                            creditCards: value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Label>Grand Total</Label>
                    <div className="rounded-md border p-2 font-bold">
                      ${currentReport.grandTotal.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      <span>Save Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Fuel className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Gas Report</h3>
              <p className="text-muted-foreground mb-4">
                Create a new gas report for this shift to start tracking gas sales.
              </p>
              {currentShift && (
                <Button onClick={handleCreateReport} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Gas Report</span>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GasPage;