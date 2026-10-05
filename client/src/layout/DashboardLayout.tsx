import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/contexts/userContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

export default function Page() {
  const location = useLocation();
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    return () => {
      root.classList.remove("dark");
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/accounts": "Accounts",
    "/dashboard/ask": "Ask Budgetly",
    "/dashboard/add-transaction": "Add Transaction",
    "/dashboard/transactions": "Transactions",
  };

  function getPageTitle(pathname: string): string {
    if (pathname.startsWith("/dashboard/transactions")) {
      return "Transactions";
    }
    return pageTitles[pathname] || "Dashboard";
  }

  const currentTitle = getPageTitle(location.pathname);

  return (
    <div className="dark min-h-svh bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="-ml-1 text-muted-foreground" />
              <h1 className="truncate text-sm font-medium text-foreground">
                {currentTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer focus-visible:ring-2 focus-visible:ring-primary">
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm text-muted-foreground">
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
            </div>
          </header>
          <div className="flex flex-1 flex-col bg-background">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
