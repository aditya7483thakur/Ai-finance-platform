import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { getAccountAlerts } from "@/lib/account-health";
import { useGetAllAccounts } from "@/services/accounts/query";
import { AccountType } from "@/types";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, CalendarDays, ChevronDown, LogOut, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
  const location = useLocation();
  const { user, userId, logout } = useUserContext();
  const openAsk = useAskBudgetly();
  const navigate = useNavigate();
  const { data: accounts } = useGetAllAccounts(userId);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    return () => {
      root.classList.remove("dark");
    };
  }, []);

  const accountList: AccountType[] = (accounts?.data ?? []) as AccountType[];
  const alerts = getAccountAlerts(accountList);

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
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const prompt = search.trim();
    setSearch("");
    openAsk(prompt || undefined);
  };

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
              <div className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-muted-foreground md:flex">
                <CalendarDays className="size-3.5" aria-hidden />
                <span>{currentMonth}</span>
                <ChevronDown className="size-3 opacity-60" aria-hidden />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground sm:hidden"
                aria-label="Ask Budgetly"
                onClick={() => openAsk()}
              >
                <Search className="size-4" />
              </Button>
              <form onSubmit={submitSearch} className="relative hidden sm:block">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search transactions, accounts..."
                  className="h-9 w-56 rounded-lg border-white/10 bg-white/[0.03] pl-8 text-xs shadow-none lg:w-72"
                  aria-label="Ask Budgetly"
                />
              </form>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground"
                    aria-label="Account alerts"
                  >
                    <Bell className="size-4" />
                    {alerts.length > 0 && (
                      <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-error" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  {alerts.length === 0 ? (
                    <DropdownMenuItem disabled>
                      No alerts right now
                    </DropdownMenuItem>
                  ) : (
                    alerts.map((alert) => (
                      <DropdownMenuItem
                        key={`${alert.account.id}-${alert.message}`}
                        onClick={() =>
                          navigate(
                            `/dashboard/transactions?accountId=${alert.account.id}`,
                          )
                        }
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm">
                            {alert.message}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            View {alert.account.name}
                          </span>
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
