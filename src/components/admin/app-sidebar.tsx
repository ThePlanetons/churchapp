import { Link } from "react-router-dom";
import { Home, Inbox, Search, Settings, User, Users } from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: Users,
  },
  {
    title: "Entity",
    url: "/admin/entity",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
