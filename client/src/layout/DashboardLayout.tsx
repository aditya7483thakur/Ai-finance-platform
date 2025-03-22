import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function Page() {
  const location = useLocation();

  // Define route-to-title mapping
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/add-transaction": "Add Transaction",
    "/dashboard/transactions": "Transactions",
  };

  console.log(location);
  // Get the current page title or default to "Page"
  const currentTitle = pageTitles[location.pathname] || "Dashboard";
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-white flex h-16 shrink-0 items-center gap-1  border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <span className="font-bold text-3xl text-primary">
            {currentTitle}
          </span>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
