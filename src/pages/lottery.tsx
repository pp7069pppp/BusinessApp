import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreSelector } from "@/components/ui/store-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLotteryStore } from "@/lib/stores/lottery-store";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { format } from "date-fns";
import { Check, QrCode, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LotteryPage = () => {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts, currentShift, setCurrentShift } = useShiftStore();
  const {
    games,
    inventory,
    scannedTickets,
    fetchGames,
    fetchInventory,
    fetchScannedTickets,
    activateBook,
    scanTicket,
    isLoading,
  } = useLotteryStore();

  const [scanData, setScanData] = useState({
    bookNumber: "",
    ticketNumber: "",
    gameNumber: "",
  });

  const [activateData, setScanBookData] = useState({
    gameNumber: "",
    bookNumber: "",
  });

  const [returnData, setReturnData] = useState({
    gameNumber: "",
    bookNumber: "",
    ticketNumber: "",
  });

  useEffect(() => {
    fetchGames();
    if (currentStore) {
      fetchShifts(currentStore.id);
      fetchInventory(currentStore.id);
    }
  }, [currentStore, fetchShifts, fetchGames, fetchInventory]);

  useEffect(() => {
    if (currentShift) {
      fetchScannedTickets(currentShift.id);
    }
  }, [currentShift, fetchScannedTickets]);

  const handleActivateBook = () => {
    if (!currentStore) {
      toast.error("Please select a store");
      return;
    }

    if (!activateData.gameNumber || !activateData.bookNumber) {
      toast.error("Please enter game number and book number");
      return;
    }

    const game = games.find(g => g.gameNumber === activateData.gameNumber);
    if (!game) {
      toast.error("Game not found");
      return;
    }

    // In a real app, you would call an API to activate the book
    toast.success("Book activated successfully");
    setScanBookData({ gameNumber: "", bookNumber: "" });
  };

  const handleReturnBook = () => {
    if (!currentStore) {
      toast.error("Please select a store");
      return;
    }

    if (!returnData.gameNumber || !returnData.bookNumber) {
      toast.error("Please enter game number and book number");
      return;
    }

    // In a real app, you would call an API to return the book
    toast.success("Book returned successfully");
    setReturnData({ gameNumber: "", bookNumber: "", ticketNumber: "" });
  };

  const handleScanTicket = () => {
    if (!currentStore || !currentShift) {
      toast.error("Please select a store and shift");
      return;
    }

    if (!scanData.gameNumber || !scanData.bookNumber || !scanData.ticketNumber) {
      toast.error("Please enter all required fields");
      return;
    }

    const game = games.find(g => g.gameNumber === scanData.gameNumber);
    if (!game) {
      toast.error("Game not found");
      return;
    }

    // In a real app, you would validate the book and ticket
    toast.success("Ticket scanned successfully");
    setScanData({ gameNumber: "", bookNumber: "", ticketNumber: "" });
  };

  const activatedBooks = inventory.filter(book => book.status === "activated");
  const returnedBooks = inventory.filter(book => book.status === "returned");

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Lottery Management</h1>
          <StoreSelector />
        </div>

        <div className="flex items-center justify-between bg-muted/40 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Shift:</span>
              {currentShift ? (
                <span>
                  #{currentShift.shiftNumber} - {format(new Date(currentShift.shiftDate), "MM-dd-yyyy")}
                </span>
              ) : (
                <span className="text-muted-foreground">No shift selected</span>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lottery Activated Books</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Scan Code and Activate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scan Code and Activate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input placeholder="Enter Code Here" />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                      >
                        <span className="sr-only">Scan</span>
                        <QrCode className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Activate Manually */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activate Manually</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Game Number" 
                      value={activateData.gameNumber}
                      onChange={(e) => setScanBookData({ ...activateData, gameNumber: e.target.value })}
                    />
                    <Input 
                      placeholder="Book Number" 
                      value={activateData.bookNumber}
                      onChange={(e) => setScanBookData({ ...activateData, bookNumber: e.target.value })}
                    />
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={handleActivateBook}
                    >
                      Activate
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Return Book */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Return Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Game Number" 
                      value={returnData.gameNumber}
                      onChange={(e) => setReturnData({ ...returnData, gameNumber: e.target.value })}
                    />
                    <Input 
                      placeholder="Book Number" 
                      value={returnData.bookNumber}
                      onChange={(e) => setReturnData({ ...returnData, bookNumber: e.target.value })}
                    />
                    <Input 
                      placeholder="Ticket Number" 
                      value={returnData.ticketNumber}
                      onChange={(e) => setReturnData({ ...returnData, ticketNumber: e.target.value })}
                    />
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={handleReturnBook}
                    >
                      Return Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="activated">
              <TabsList>
                <TabsTrigger value="activated">Activated Books</TabsTrigger>
                <TabsTrigger value="returned">Returned Books</TabsTrigger>
              </TabsList>
              <TabsContent value="activated">
                {activatedBooks.length > 0 ? (
                  <DataTable
                    data={activatedBooks}
                    columns={[
                      {
                        header: "Game",
                        accessorKey: (row) => row.game?.gameName || "Unknown",
                      },
                      {
                        header: "Game #",
                        accessorKey: (row) => row.game?.gameNumber || "Unknown",
                      },
                      {
                        header: "Book #",
                        accessorKey: "bookNumber",
                      },
                      {
                        header: "Start #",
                        accessorKey: "startNumber",
                      },
                      {
                        header: "End #",
                        accessorKey: "endNumber",
                      },
                      {
                        header: "Status",
                        accessorKey: "status",
                        cell: (row) => (
                          <span className="capitalize">{row.status}</span>
                        ),
                      },
                    ]}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-muted-foreground">Activated books will show here!</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="returned">
                {returnedBooks.length > 0 ? (
                  <DataTable
                    data={returnedBooks}
                    columns={[
                      {
                        header: "Game",
                        accessorKey: (row) => row.game?.gameName || "Unknown",
                      },
                      {
                        header: "Game #",
                        accessorKey: (row) => row.game?.gameNumber || "Unknown",
                      },
                      {
                        header: "Book #",
                        accessorKey: "bookNumber",
                      },
                      {
                        header: "Ticket #",
                        accessorKey: "endNumber",
                      },
                      {
                        header: "Status",
                        accessorKey: "status",
                        cell: (row) => (
                          <span className="capitalize">{row.status}</span>
                        ),
                      },
                    ]}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-muted-foreground">Returned books will show here!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lottery Ticket Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scan Code Here */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scan Code Here</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input placeholder="Enter Code Here" />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                      >
                        <span className="sr-only">Scan</span>
                        <QrCode className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Add Ticket Manually */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Ticket Manually</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Game Number" 
                      value={scanData.gameNumber}
                      onChange={(e) => setScanData({ ...scanData, gameNumber: e.target.value })}
                    />
                    <Input 
                      placeholder="Book Number" 
                      value={scanData.bookNumber}
                      onChange={(e) => setScanData({ ...scanData, bookNumber: e.target.value })}
                    />
                    <Input 
                      placeholder="Ticket Number" 
                      value={scanData.ticketNumber}
                      onChange={(e) => setScanData({ ...scanData, ticketNumber: e.target.value })}
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Count: ({scannedTickets.length}) Last Ticket Scanned: {scannedTickets.length > 0 ? scannedTickets[0].ticketNumber : ""}
                        </span>
                      </div>
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={handleScanTicket}
                      >
                        Finish Scanning
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {scannedTickets.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Scanned Tickets</h3>
                <DataTable
                  data={scannedTickets}
                  columns={[
                    {
                      header: "Game",
                      accessorKey: "gameName",
                    },
                    {
                      header: "Book #",
                      accessorKey: "bookNumber",
                    },
                    {
                      header: "Ticket #",
                      accessorKey: "ticketNumber",
                    },
                    {
                      header: "Quantity",
                      accessorKey: "quantitySold",
                    },
                    {
                      header: "Total",
                      accessorKey: "total",
                      cell: (row) => `$${row.total.toFixed(2)}`,
                    },
                  ]}
                  isLoading={isLoading}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LotteryPage;