import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Outlet, useLocation } from "react-router-dom";

export default function Page() {
  const location = useLocation();

  // Define static route-to-title mapping
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/add-transaction": "Transaction",
    "/dashboard/transactions": "Account Details",
  };

  // Helper to get dynamic title
  function getPageTitle(pathname: string): string {
    if (pathname.startsWith("/dashboard/transactions/"))
      return "Account Details";
    if (pathname === "/dashboard/transactions") return "Account Details";
    return pageTitles[pathname] || "Dashboard";
  }

  const currentTitle = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-white flex h-16 shrink-0 items-center justify-between gap-1 border-b border-border px-4 pr-8">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <span className="font-bold text-3xl text-primary">
              {currentTitle}
            </span>
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
