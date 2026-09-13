import { Home, PlusCircle, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Ask Budgetly",
    url: "/dashboard/ask",
    icon: Sparkles,
  },
  {
    title: "Add Transaction",
    url: "/dashboard/add-transaction",
    icon: PlusCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-3 px-2 text-xl font-semibold text-primary">
            Budgetly
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6 space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const isAsk = item.url === "/dashboard/ask";
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.url}
                        className={cn(
                          "w-full rounded-lg px-2",
                          isActive && !isAsk && "bg-primary/10 text-primary",
                          isAsk && "text-accent hover:bg-accent/10 hover:text-accent",
                          isAsk && isActive && "bg-accent/10 text-accent",
                        )}
                      >
                        <item.icon />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
