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
        <header className="sticky top-0 z-10 p-4 bg-white shadow flex justify-between items-center">
          <SidebarTrigger /> {/* Button to toggle the sidebar */}
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>

        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>

        <Toaster />

        <footer className="p-4 bg-white shadow flex justify-between items-center">
          <h1 className="text-xl font-bold">Footer</h1>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
