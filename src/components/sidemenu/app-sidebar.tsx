import {
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  Presentation,
  Settings2,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavUser } from "./nav-user";
import RippleEffect from "../motion/ripple-effect";
import { Separator } from "../ui/separator";
import { useTheme } from "../theme/theme-provider";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    url: "/students",
    icon: GraduationCap,
  },
  {
    title: "Placement Drive",
    url: "/placement-drive",
    icon: BriefcaseBusiness,
  },
  {
    title: "Training Module",
    url: "/training-module",
    icon: Presentation,
  },
  {
    title: "Events",
    url: "/events",
    icon: Handshake,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme } = useTheme();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {theme == "light" ? (
              <img
                src="/logo-dark.svg"
                alt="SucceedEx Logo"
                className="h-6 w-6"
              />
            ) : (
              <img
                src="/logo-light.svg"
                alt="SucceedEx Logo"
                className="h-6 w-6"
              />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SucceedEx</span>
            <span className="truncate text-xs">Training & Placements</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <div className="px-4">
        <Separator />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname.split("/").slice(0, 2).join("/") === item.url
                      }
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex">
                        <RippleEffect className="bg-background/50" />
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
