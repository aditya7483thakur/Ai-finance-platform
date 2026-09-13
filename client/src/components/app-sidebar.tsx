import {
  Home,
  LayoutList,
  LogOut,
  PlusCircle,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/contexts/userContext";
import { useGetAllAccounts } from "@/services/accounts/query";
import { AccountType } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userId, logout } = useUserContext();
  const { data: accounts } = useGetAllAccounts(userId);
  const accountList: AccountType[] = (accounts?.data ?? []) as AccountType[];
  const firstAccountId = accountList[0]?.id;

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive:
        location.pathname === "/dashboard" && location.hash !== "#accounts",
    },
    {
      title: "Ask Budgetly",
      url: "/dashboard/ask",
      icon: Sparkles,
      isActive: location.pathname === "/dashboard/ask",
    },
    {
      title: "Add Transaction",
      url: "/dashboard/add-transaction",
      icon: PlusCircle,
      isActive: location.pathname === "/dashboard/add-transaction",
    },
    {
      title: "Accounts",
      url: "/dashboard#accounts",
      icon: Wallet,
      isActive:
        location.pathname === "/dashboard" && location.hash === "#accounts",
    },
    {
      title: "Transactions",
      url: firstAccountId
        ? `/dashboard/transactions/${firstAccountId}`
        : "/dashboard#accounts",
      icon: LayoutList,
      isActive: location.pathname.startsWith("/dashboard/transactions/"),
    },
  ];

  return (
    <Sidebar className="border-sidebar-border">
      <SidebarHeader className="px-4 pt-5 pb-2">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Budgetly
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-3 gap-1 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className={cn(
                      "h-9 rounded-lg px-3 text-sidebar-foreground hover:bg-white/5 hover:text-foreground",
                      item.isActive &&
                        "bg-primary text-white hover:bg-primary hover:text-white",
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-xs text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {user.email}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuItem className="text-sm text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
