import { Home, Inbox } from "lucide-react";

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
import { Link } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Add Transaction",
    url: "/dashboard/add-transaction",
    icon: Inbox,
  },
  {
    title: "Generate report",
    url: "/dashboard/transactions",
    icon: Inbox,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-primary text-3xl mt-3">
            💸Budgetly
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="bg-primary text-white border rounded-xl p-2"
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className=" w-full">
                      <item.icon />
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
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
