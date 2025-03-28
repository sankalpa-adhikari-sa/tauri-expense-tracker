import {
  Calendar,
  CalendarCheck,
  Home,
  Inbox,
  Layers,
  Receipt,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

const Mobileitems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Options",
    url: "/options",
    icon: Layers,
  },

  {
    title: "Transactions",
    url: "/transactions",
    icon: Receipt,
  },
  {
    title: "Events",
    url: "/envents",
    icon: CalendarCheck,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppMobileSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu className="fixed bottom-0 flex-row justify-around bg-sidebar pt-2 ">
          {Mobileitems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton size={"tab"} asChild>
                <Link className="flex flex-col" to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
