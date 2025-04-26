import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronsUpDown, LogOut, UserPen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";
import { api } from "@/components/api/fetcher";
import { routes } from "@/components/api/route";
import { setCookie } from "typescript-cookie";
import { toast } from "sonner";
import { useAtomValue } from "jotai";
import { useTheme } from "../theme/theme-provider";
import { userAtom } from "@/global/userAtom";

export function NavUser() {
  const { isMobile } = useSidebar();
  const user: any = useAtomValue(userAtom);
  const mutation = api.post(routes.auth.logout);
  const { theme } = useTheme();

  const handleLogout = () => {
    mutation.mutate(
      {},
      {
        onSuccess: (data: any) => {
          toast.success(`${data.detail}`, {
            description: `${new Date().toLocaleTimeString()}`,
          });
          setCookie("access_token", "", { path: "/" });
          setCookie("refresh_token", "", { path: "/" });
          setCookie("token_type", "", { path: "/" });
          window.location.href = import.meta.env.VITE_APP_AUTH_URL;
        },
        onError: (error) => {
          toast.error(`${error}`, {
            description: `${new Date().toLocaleTimeString()}`,
          });
        },
      }
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={`${import.meta.env.VITE_APP_API_URL}${
                    routes.files.get + user?.profile?.avatar_pic
                  }`}
                  alt={user?.username}
                />
                <AvatarFallback>pic</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex gap-1 justify-start items-center">
                  <span className="truncate text-base font-semibold capitalize">
                    {user?.username}
                  </span>
                  <Badge
                    variant={"info"}
                    className={`font-bold text-[8px] text-foreground/80 px-2 lowercase ${
                      theme == "light" && "bg-accent"
                    }`}
                  >
                    {user?.role?.name}
                  </Badge>
                </div>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={`${import.meta.env.VITE_APP_API_URL}${
                      routes.files.get + user?.profile?.avatar_pic
                    }`}
                    alt={user?.username}
                  />
                  <AvatarFallback>ccps</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex gap-1 justify-start items-center">
                    <span className="truncate text-base font-semibold capitalize">
                      {user?.username}
                    </span>
                    <Badge
                      variant={"info"}
                      className={`font-bold text-[8px] px-2 lowercase`}
                    >
                      {user?.role?.name}
                    </Badge>
                  </div>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserPen />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
