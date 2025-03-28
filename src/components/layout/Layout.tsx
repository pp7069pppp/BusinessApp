import { ReactNode } from "react";
import { Header } from "./Header";
import { AppSidebar } from "./Sidebar";
import { useSidebar } from "./sidebar-provider";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { expanded } = useSidebar();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <main className={`flex-1 p-4 md:p-6 ${expanded ? 'lg:ml-64' : 'lg:ml-16'} transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}