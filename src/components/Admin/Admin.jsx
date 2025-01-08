import AdminContent from "./AdminContent";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar/Sidebar";

export function Admin() {
  return (
    <div className='flex flex-row w-full min-h-screen'>
      <div className="flex w-full bg-gray-100">
        <div className="flex-shrink-0 h-screen w-64 bg-gray-300 shadow-md fixed">
          <Sidebar />
        </div>

        <div className="flex grow flex-col ml-64">
          <AdminHeader />

          <AdminContent />
        </div>
      </div>
    </div>
  );
}