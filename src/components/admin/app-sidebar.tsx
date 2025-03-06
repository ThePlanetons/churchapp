import { Link, useLocation } from "react-router-dom";
import { Home, Settings, User, Users, HandCoins, BookUser } from "lucide-react"

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
    icon: BookUser,
  },
  {
    title: "Collection",
    url: "/admin/collections",
    icon: HandCoins,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      {/* --primary: 249 71% 65%; /* #7565E6 */}
      {/* className="bg-[#151529]" - velzon */}
      {/* <SidebarContent className="bg-[#1e40af]"> - midone */}
      <SidebarContent className="bg-[#5c5c5c]"> 
        <SidebarGroup className="gap-5 py-5">
          <SidebarGroupLabel className="text-2xl font-bold text-[#ffffff] tracking-wider">Victory Harvest</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    {/* ${isActive ? "text-[#f7f7f7]" : "text-[#a3a6b7]"} - velzon */}
                    <SidebarMenuButton
                      asChild
                      className={`text-md py-5 px-3 hover:text-[#F6F6F5] hover:bg-[#2c2c2c] tracking-wider
                      ${isActive ? "text-[#F6F6F5] bg-[#2c2c2c]" : "text-[#babdc2]"}
                      `}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon
                          style={{ width: "18px", height: "18px" }}
                          className={isActive ? "" : "text-inherit"}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {/* {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-[#F6F6F5] text-md font-medium py-5 hover:border hover:border-[#8e89f0] hover:text-[#8e89f0]">
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon style={{ width: "22px", height: "22px" }} />
                      <span className="tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}