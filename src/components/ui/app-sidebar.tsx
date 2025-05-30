import * as React from "react";
import {
  IconDevices,
  IconCode,
  IconActivityHeartbeat,
  IconPlugConnected,
  IconSettings,
  IconTags,
  IconDashboard,
  IconUsers,
  IconBuildingStore, // Import icon for providers
  //IconAlertTriangle,
  //IconDatabase,
} from "@tabler/icons-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

interface AppSidebarProps {
  variant?: "default" | "inset";
  onQuickCreateClick?: () => void;
}

const data = {
  navMain: [
    {
      title: "dashboard",
      url: "/",
      icon: IconDashboard,
    },

    {
      title: "flows",
      url: "/flows",
      icon: IconActivityHeartbeat,
    },
    {
      title: "devices",
      url: "/devices",
      icon: IconDevices,
    },
    {
      title: "labels",
      url: "/labels",
      icon: IconTags,
    },
    {
      title: "functions",
      url: "/functions",
      icon: IconCode,
    },
    {
      title: "integrations",
      url: "/integrations",
      icon: IconPlugConnected,
    },
    {
      title: "providers",
      url: "/providers",
      icon: IconBuildingStore,
    },
    /*
    {
      title: "alerts",
      url: "/alerts",
      icon: IconAlertTriangle,
      badge: "1",
    },
    {
      title: "storage",
      url: "/storage",
      icon: IconDatabase,
      badge: "1",
    },
    */
    {
      title: "teams",
      url: "/teams",
      icon: IconUsers,
    },
    {
      title: "settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({
  variant = "inset",
  onQuickCreateClick,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  // The user data will now come from the AuthContext via NavUser component

  return (
    <Sidebar variant={variant} collapsible="offcanvas" {...props}>
      <div className="flex h-full flex-col gap-4">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link to="/">
                  <img
                    src="/device-manager-icon.svg"
                    alt="Node Dash"
                    width="28px"
                  />
                  <span className="text-base font-semibold">Node Dash</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain
            items={data.navMain}
            onQuickCreateClick={onQuickCreateClick}
          />
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
