import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/sidemenu/app-sidebar";
import CustomBreadcrumb from "@/components/breadcrumb/CustomBreadcrumb";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Outlet } from "react-router";
import { Separator } from "@/components/ui/separator";

export default function SideMenuLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex py-2 md:py-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <CustomBreadcrumb />
          </div>
          <div className="flex justify-end items-center gap-2 flex-1 px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="md:px-4 mb-4">
            <Separator />
          </div>
        <div className="p-4 pt-0 w-full overflow-x-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
