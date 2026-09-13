import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Page() {
  const location = useLocation();
  const { user, logout } = useUserContext();
  const openAsk = useAskBudgetly();
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

  const pageTitles: Record<string, string> = {
    "/dashboard": "Workspace",
    "/dashboard/ask": "Ask Budgetly",
    "/dashboard/add-transaction": "Add transaction",
    "/dashboard/transactions": "Account activity",
  };

  function getPageTitle(pathname: string): string {
    if (pathname.startsWith("/dashboard/transactions/")) {
      return "Account activity";
    }
    return pageTitles[pathname] || "Workspace";
  }

  const currentTitle = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div>
              <h1 className="truncate text-lg font-semibold text-slate-900">
                {currentTitle}
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Understand, manage, and simulate your finances
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {location.pathname !== "/dashboard/ask" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent/25 bg-accent/10 text-accent hover:bg-accent/15 hover:text-accent"
                onClick={() => openAsk()}
              >
                <Sparkles className="size-4" aria-hidden />
                Ask Budgetly
              </Button>
            )}
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
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
