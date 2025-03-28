import { 
  BarChart3, 
  Calculator, 
  Calendar, 
  Fuel, 
  Home, 
  LayoutDashboard, 
  Ticket 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useSidebar } from "./sidebar-provider";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Shifts",
    url: "/shifts",
    icon: Calendar,
  },
  {
    title: "Business Report",
    url: "/business-report",
    icon: Calculator,
  },
  {
    title: "Lottery",
    url: "/lottery",
    icon: Ticket,
  },
  {
    title: "Gas Sales",
    url: "/gas",
    icon: Fuel,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  // We're using the useSidebar hook here, which is now available
  // because we wrapped our app with SidebarProvider
  const { expanded } = useSidebar();

  return (
    <Sidebar expanded={expanded}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Calc</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}