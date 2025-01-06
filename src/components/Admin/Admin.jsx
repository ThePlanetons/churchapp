import AdminContent from "./AdminContent";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar/Sidebar";

export function Admin() {
  return (
    <div className='flex flex-row w-full h-screen'>
      <div className="flex w-full bg-gray-100">
        <Sidebar />

        <div className="flex-1">
          <AdminHeader />
          
          <AdminContent />
        </div>
      </div>
    </div>
  );
}