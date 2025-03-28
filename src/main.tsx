import { Toaster as Sonner } from "@/components/ui/sonner";

import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { TooltipProvider } from "./components/ui/tooltip";

import { ThemeProvider } from "./components/layout/theme-provider";
import { SidebarProvider } from "./components/layout/sidebar-provider";
import "./index.css";
import Index from "./pages";
import ShiftsPage from "./pages/shifts";
import BusinessReportPage from "./pages/business-report";
import LotteryPage from "./pages/lottery";
import GasPage from "./pages/gas";
import ReportsPage from "./pages/reports";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shifts" element={<ShiftsPage />} />
              <Route path="/business-report" element={<BusinessReportPage />} />
              <Route path="/lottery" element={<LotteryPage />} />
              <Route path="/gas" element={<GasPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </BrowserRouter>
          <Sonner />
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);