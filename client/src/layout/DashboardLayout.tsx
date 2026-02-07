import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/contexts/userContext";
import { Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Page() {
  const location = useLocation();
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-sm text-gray-500">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
