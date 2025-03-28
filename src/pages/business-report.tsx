import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreSelector } from "@/components/ui/store-selector";
import { useBusinessReportStore } from "@/lib/stores/business-report-store";
import { useShiftStore } from "@/lib/stores/shift-store";
import { useStoreStore } from "@/lib/stores/store-store";
import { format } from "date-fns";
import { Calculator, Printer, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const BusinessReportPage = () => {
  const { currentStore } = useStoreStore();
  const { shifts, fetchShifts, currentShift, setCurrentShift } = useShiftStore();
  const {
    currentReport,
    fetchBusinessReport,
    createBusinessReport,
    updateBusinessReport,
    calculateOverShort,
    calculateCashToAccount,
    isLoading,
  } = useBusinessReportStore();

  const [searchParams] = useSearchParams();
  const shiftIdParam = searchParams.get("shiftId");

  const [formData, setFormData] = useState({
    netSalesRegister: 0,
    netTaxes: 0,
    mealTax: 0,
    refund: 0,
    cheque: 0,
    creditCard: 0,
    registerCash: 0,
    overShort: 0,
    cashToAccount: 0,
    customerCredits: 0,
    customerDebits: 0,
    gasSales: 0,
    notes: "",
    // Lottery data
    lotteryTodayOnlineNetSales: 0,
    lotteryYesterdayOnlineNetSales: 0,
    lotteryTodayOnlineCashing: 0,
    lotteryYesterdayOnlineCashing: 0,
    lotteryTodayInstantCashing: 0,
    lotteryYesterdayInstantCashing: 0,
    lotteryTodayInstantSale: 0,
    lotteryYesterdayInstantSale: 0,
    lotteryCredits: 0,
    lotteryDebits: 0,
    lotteryOnlineBalance: 0,
    lotteryInstantBalance: 0,
    lotteryTotalBalance: 0,
    lotteryRegisterCash: 0,
    lotteryOverShort: 0,
  });

  const [purchases, setPurchases] = useState([
    { id: 1, vendorName: "", amount: 0 }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, category: "", amount: 0 }
  ]);

  useEffect(() => {
    if (currentStore) {
      fetchShifts(currentStore.id);
    }
  }, [currentStore, fetchShifts]);

  useEffect(() => {
    if (shiftIdParam && shifts.length > 0) {
      const shiftId = parseInt(shiftIdParam);
      setCurrentShift(shiftId);
    }
  }, [shiftIdParam, shifts, setCurrentShift]);

  useEffect(() => {
    if (currentShift) {
      fetchBusinessReport(currentShift.id);
    }
  }, [currentShift, fetchBusinessReport]);

  useEffect(() => {
    if (currentReport) {
      setFormData({
        netSalesRegister: currentReport.netSalesRegister,
        netTaxes: currentReport.netTaxes,
        mealTax: currentReport.mealTax,
        refund: currentReport.refund,
        cheque: currentReport.cheque,
        creditCard: currentReport.creditCard,
        registerCash: currentReport.registerCash,
        overShort: currentReport.overShort,
        cashToAccount: currentReport.cashToAccount,
        customerCredits: currentReport.customerCredits || 0,
        customerDebits: currentReport.customerDebits || 0,
        gasSales: currentReport.gasSales || 0,
        notes: currentReport.notes || "",
        // Lottery data
        lotteryTodayOnlineNetSales: currentReport.lotteryTodayOnlineNetSales || 0,
        lotteryYesterdayOnlineNetSales: currentReport.lotteryYesterdayOnlineNetSales || 0,
        lotteryTodayOnlineCashing: currentReport.lotteryTodayOnlineCashing || 0,
        lotteryYesterdayOnlineCashing: currentReport.lotteryYesterdayOnlineCashing || 0,
        lotteryTodayInstantCashing: currentReport.lotteryTodayInstantCashing || 0,
        lotteryYesterdayInstantCashing: currentReport.lotteryYesterdayInstantCashing || 0,
        lotteryTodayInstantSale: currentReport.lotteryTodayInstantSale || 0,
        lotteryYesterdayInstantSale: currentReport.lotteryYesterdayInstantSale || 0,
        lotteryCredits: currentReport.lotteryCredits || 0,
        lotteryDebits: currentReport.lotteryDebits || 0,
        lotteryOnlineBalance: currentReport.lotteryOnlineBalance || 0,
        lotteryInstantBalance: currentReport.lotteryInstantBalance || 0,
        lotteryTotalBalance: currentReport.lotteryTotalBalance || 0,
        lotteryRegisterCash: currentReport.lotteryRegisterCash || 0,
        lotteryOverShort: currentReport.lotteryOverShort || 0,
      });
    } else {
      setFormData({
        netSalesRegister: 0,
        netTaxes: 0,
        mealTax: 0,
        refund: 0,
        cheque: 0,
        creditCard: 0,
        registerCash: 0,
        overShort: 0,
        cashToAccount: 0,
        customerCredits: 0,
        customerDebits: 0,
        gasSales: 0,
        notes: "",
        // Lottery data
        lotteryTodayOnlineNetSales: 0,
        lotteryYesterdayOnlineNetSales: 0,
        lotteryTodayOnlineCashing: 0,
        lotteryYesterdayOnlineCashing: 0,
        lotteryTodayInstantCashing: 0,
        lotteryYesterdayInstantCashing: 0,
        lotteryTodayInstantSale: 0,
        lotteryYesterdayInstantSale: 0,
        lotteryCredits: 0,
        lotteryDebits: 0,
        lotteryOnlineBalance: 0,
        lotteryInstantBalance: 0,
        lotteryTotalBalance: 0,
        lotteryRegisterCash: 0,
        lotteryOverShort: 0,
      });
    }
  }, [currentReport]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = name === "notes" ? value : parseFloat(value) || 0;
    
    const updatedFormData = {
      ...formData,
      [name]: numValue,
    };
    
    // Calculate derived values
    if (['netSalesRegister', 'creditCard', 'cheque', 'registerCash'].includes(name)) {
      updatedFormData.overShort = calculateOverShort(updatedFormData);
    }
    
    if (name === 'registerCash') {
      updatedFormData.cashToAccount = calculateCashToAccount(updatedFormData);
    }
    
    // Calculate lottery balances
    if ([
      'lotteryTodayOnlineNetSales', 
      'lotteryYesterdayOnlineNetSales', 
      'lotteryTodayOnlineCashing', 
      'lotteryYesterdayOnlineCashing',
      'lotteryTodayInstantSale',
      'lotteryYesterdayInstantSale',
      'lotteryTodayInstantCashing',
      'lotteryYesterdayInstantCashing',
      'lotteryCredits',
      'lotteryDebits',
      'lotteryRegisterCash'
    ].includes(name)) {
      const onlineBalance = 
        updatedFormData.lotteryTodayOnlineNetSales - 
        updatedFormData.lotteryTodayOnlineCashing;
      
      const instantBalance = 
        updatedFormData.lotteryTodayInstantSale - 
        updatedFormData.lotteryTodayInstantCashing;
      
      const totalBalance = onlineBalance + instantBalance + 
        updatedFormData.lotteryCredits - updatedFormData.lotteryDebits;
      
      updatedFormData.lotteryOnlineBalance = onlineBalance;
      updatedFormData.lotteryInstantBalance = instantBalance;
      updatedFormData.lotteryTotalBalance = totalBalance;
      
      // Calculate lottery over/short
      updatedFormData.lotteryOverShort = 
        updatedFormData.lotteryRegisterCash - totalBalance;
    }
    
    setFormData(updatedFormData);
  };

  const handleAddPurchase = () => {
    const newId = Math.max(0, ...purchases.map(p => p.id)) + 1;
    setPurchases([...purchases, { id: newId, vendorName: "", amount: 0 }]);
  };

  const handlePurchaseChange = (id: number, field: string, value: string | number) => {
    setPurchases(purchases.map(p => 
      p.id === id ? { ...p, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value } : p
    ));
  };

  const handleAddExpense = () => {
    const newId = Math.max(0, ...expenses.map(e => e.id)) + 1;
    setExpenses([...expenses, { id: newId, category: "", amount: 0 }]);
  };

  const handleExpenseChange = (id: number, field: string, value: string | number) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value } : e
    ));
  };

  const calculatePurchasesTotal = () => {
    return purchases.reduce((sum, p) => sum + p.amount, 0);
  };

  const calculateExpensesTotal = () => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentStore || !currentShift) {
      toast.error("Please select a store and shift");
      return;
    }
    
    try {
      if (currentReport) {
        await updateBusinessReport({
          ...currentReport,
          ...formData,
        });
        toast.success("Business report updated successfully");
      } else {
        await createBusinessReport({
          ...formData,
          shiftId: currentShift.id,
          storeId: currentStore.id,
        });
        toast.success("Business report created successfully");
      }
    } catch (error) {
      toast.error("Failed to save business report");
    }
  };

  const handleDeleteShift = () => {
    // Implement delete shift functionality
    toast.success("Shift deleted successfully");
  };

  const handlePrintReport = () => {
    // Implement print report functionality
    toast.success("Printing report...");
  };

  const handleEmailReport = () => {
    // Implement email report functionality
    toast.success("Report emailed successfully");
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Business Report</h1>
          <StoreSelector />
        </div>

        <Tabs defaultValue="business">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="business">Business Report</TabsTrigger>
            <TabsTrigger value="gas">Gas Report</TabsTrigger>
            <TabsTrigger value="cash">Cash Drop</TabsTrigger>
            <TabsTrigger value="lotto">Lotto Vending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business" className="space-y-4">
            <div className="flex items-center justify-between bg-muted/40 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Shift:</span>
                  <Select 
                    value={currentShift?.id.toString()} 
                    onValueChange={(value) => setCurrentShift(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id.toString()}>
                          #{shift.shiftNumber} - {format(new Date(shift.shiftDate), "MM-dd-yyyy")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handlePrintReport}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline" onClick={handleEmailReport}>
                  Email Report
                </Button>
                <Button variant="destructive" onClick={handleDeleteShift}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Shift
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Report Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="netSalesRegister">Gross Sales</Label>
                      <Input
                        id="netSalesRegister"
                        name="netSalesRegister"
                        type="number"
                        step="0.01"
                        value={formData.netSalesRegister}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gasSales">Gas Sales</Label>
                      <Input
                        id="gasSales"
                        name="gasSales"
                        type="number"
                        step="0.01"
                        value={formData.gasSales}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cheque">Check</Label>
                      <Input
                        id="cheque"
                        name="cheque"
                        type="number"
                        step="0.01"
                        value={formData.cheque}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creditCard">Credit Card</Label>
                      <Input
                        id="creditCard"
                        name="creditCard"
                        type="number"
                        step="0.01"
                        value={formData.creditCard}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerCredits">Customer Credits</Label>
                      <Input
                        id="customerCredits"
                        name="customerCredits"
                        type="number"
                        step="0.01"
                        value={formData.customerCredits}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerDebits">Customer Debits</Label>
                      <Input
                        id="customerDebits"
                        name="customerDebits"
                        type="number"
                        step="0.01"
                        value={formData.customerDebits}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase/Expenses Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Purchase/Expenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      <Label className="col-span-3">Vendor Name</Label>
                      <Label className="col-span-1">Amount</Label>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-3">
                          <Select 
                            value={purchase.vendorName} 
                            onValueChange={(value) => handlePurchaseChange(purchase.id, 'vendorName', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vendor1">Vendor 1</SelectItem>
                              <SelectItem value="vendor2">Vendor 2</SelectItem>
                              <SelectItem value="vendor3">Vendor 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          value={purchase.amount}
                          onChange={(e) => handlePurchaseChange(purchase.id, 'amount', e.target.value)}
                          className="col-span-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setPurchases(purchases.filter(p => p.id !== purchase.id))}
                          className="col-span-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button variant="outline" onClick={handleAddPurchase} className="w-full">
                      Add Purchase
                    </Button>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span>${calculatePurchasesTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Others</h3>
                    
                    <div className="grid grid-cols-5 gap-2">
                      <Label className="col-span-3">Category</Label>
                      <Label className="col-span-1">Amount</Label>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {expenses.map((expense) => (
                      <div key={expense.id} className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-3">
                          <Select 
                            value={expense.category} 
                            onValueChange={(value) => handleExpenseChange(expense.id, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="supplies">Supplies</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          value={expense.amount}
                          onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                          className="col-span-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
                          className="col-span-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button variant="outline" onClick={handleAddExpense} className="w-full">
                      Add Expense
                    </Button>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span>${calculateExpensesTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Lottery Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Today Invoice */}
                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Today Invoice</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryTodayOnlineNetSales">Online Net Sales</Label>
                          <Input
                            id="lotteryTodayOnlineNetSales"
                            name="lotteryTodayOnlineNetSales"
                            type="number"
                            step="0.01"
                            value={formData.lotteryTodayOnlineNetSales}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryTodayOnlineCashing">Online Cashing</Label>
                          <Input
                            id="lotteryTodayOnlineCashing"
                            name="lotteryTodayOnlineCashing"
                            type="number"
                            step="0.01"
                            value={formData.lotteryTodayOnlineCashing}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryTodayInstantCashing">Instant Cashing</Label>
                          <Input
                            id="lotteryTodayInstantCashing"
                            name="lotteryTodayInstantCashing"
                            type="number"
                            step="0.01"
                            value={formData.lotteryTodayInstantCashing}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryTodayInstantSale">Instant Sale</Label>
                          <Input
                            id="lotteryTodayInstantSale"
                            name="lotteryTodayInstantSale"
                            type="number"
                            step="0.01"
                            value={formData.lotteryTodayInstantSale}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      {/* Yesterday Invoice */}
                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Yesterday Invoice</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryYesterdayOnlineNetSales">Online Net Sales</Label>
                          <Input
                            id="lotteryYesterdayOnlineNetSales"
                            name="lotteryYesterdayOnlineNetSales"
                            type="number"
                            step="0.01"
                            value={formData.lotteryYesterdayOnlineNetSales}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryYesterdayOnlineCashing">Online Cashing</Label>
                          <Input
                            id="lotteryYesterdayOnlineCashing"
                            name="lotteryYesterdayOnlineCashing"
                            type="number"
                            step="0.01"
                            value={formData.lotteryYesterdayOnlineCashing}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryYesterdayInstantCashing">Instant Cashing</Label>
                          <Input
                            id="lotteryYesterdayInstantCashing"
                            name="lotteryYesterdayInstantCashing"
                            type="number"
                            step="0.01"
                            value={formData.lotteryYesterdayInstantCashing}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryYesterdayInstantSale">Instant Sale</Label>
                          <Input
                            id="lotteryYesterdayInstantSale"
                            name="lotteryYesterdayInstantSale"
                            type="number"
                            step="0.01"
                            value={formData.lotteryYesterdayInstantSale}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      {/* Today Cash */}
                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Today Cash</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryCredits">Credits Sale</Label>
                          <Input
                            id="lotteryCredits"
                            name="lotteryCredits"
                            type="number"
                            step="0.01"
                            value={formData.lotteryCredits}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryDebits">Debits Sale</Label>
                          <Input
                            id="lotteryDebits"
                            name="lotteryDebits"
                            type="number"
                            step="0.01"
                            value={formData.lotteryDebits}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryOnlineBalance">Online Balance</Label>
                          <Input
                            id="lotteryOnlineBalance"
                            name="lotteryOnlineBalance"
                            type="number"
                            step="0.01"
                            value={formData.lotteryOnlineBalance}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryInstantBalance">Instant Balance</Label>
                          <Input
                            id="lotteryInstantBalance"
                            name="lotteryInstantBalance"
                            type="number"
                            step="0.01"
                            value={formData.lotteryInstantBalance}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryTotalBalance">Total Balance</Label>
                          <Input
                            id="lotteryTotalBalance"
                            name="lotteryTotalBalance"
                            type="number"
                            step="0.01"
                            value={formData.lotteryTotalBalance}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryRegisterCash">Register Cash</Label>
                          <Input
                            id="lotteryRegisterCash"
                            name="lotteryRegisterCash"
                            type="number"
                            step="0.01"
                            value={formData.lotteryRegisterCash}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotteryOverShort">Over/Short</Label>
                          <Input
                            id="lotteryOverShort"
                            name="lotteryOverShort"
                            type="number"
                            step="0.01"
                            value={formData.lotteryOverShort}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashToAccount">Cash to Account</Label>
                      <Input
                        id="cashToAccount"
                        name="cashToAccount"
                        type="number"
                        step="0.01"
                        value={formData.cashToAccount}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="overShort">Over/Short</Label>
                      <Input
                        id="overShort"
                        name="overShort"
                        type="number"
                        step="0.01"
                        value={formData.overShort}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      onClick={handleSubmit} 
                      disabled={isLoading} 
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Report"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gas">
            <Card>
              <CardHeader>
                <CardTitle>Gas Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gas report content will go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cash">
            <Card>
              <CardHeader>
                <CardTitle>Cash Drop</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Cash drop content will go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lotto">
            <Card>
              <CardHeader>
                <CardTitle>Lotto Vending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Lottery Activated Books Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Lottery Activated Books</h3>
                    
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
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
                            <Input placeholder="Game Number" />
                            <Input placeholder="Book Number" />
                            <Button className="w-full bg-green-500 hover:bg-green-600">Activate</Button>
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
                            <Input placeholder="Game Number" />
                            <Input placeholder="Book Number" />
                            <Input placeholder="Ticket Number" />
                            <Button className="w-full bg-green-500 hover:bg-green-600">Return Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <Tabs defaultValue="activated">
                        <TabsList>
                          <TabsTrigger value="activated">Activated Books</TabsTrigger>
                          <TabsTrigger value="returned">Returned Books</TabsTrigger>
                        </TabsList>
                        <TabsContent value="activated" className="p-4 border rounded-md mt-2">
                          <p className="text-center text-muted-foreground">Activated books will show here!</p>
                        </TabsContent>
                        <TabsContent value="returned" className="p-4 border rounded-md mt-2">
                          <p className="text-center text-muted-foreground">Returned books will show here!</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  
                  {/* Lottery Ticket Scan Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Lottery Ticket Scan</h3>
                    
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
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
                            <Input placeholder="Game Number" />
                            <Input placeholder="Book Number" />
                            <Input placeholder="Ticket Number" />
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-muted-foreground">Count: (0) Last Ticket Scanned:</span>
                              </div>
                              <Button className="bg-blue-500 hover:bg-blue-600">Finish Scanning</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessReportPage;