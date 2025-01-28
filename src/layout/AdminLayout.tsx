import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

import { AppSidebar } from "@/components/admin/app-sidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col h-screen">
        <header className="p-4 bg-white shadow flex justify-between items-center">
          <SidebarTrigger /> {/* Button to toggle the sidebar */}
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>

        <main className="flex-1 p-6 bg-gray-100">
          <Outlet /> {/* Renders the nested route (AdminDashboard or UsersPage) */}
        </main>

        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
