import { Dashboard } from "./Dashboard/Dashboard";
import { Sidebar } from "./Member/sidebar/Sidebar";
import { MemberHeader } from "./Member/member/MemberHeader";
import { MemberContent } from "./Member/member/MemberContent";

export function Admin() {
  return (
    <div className='flex flex-row'>
      {/* <Dashboard /> */}
      <div className="flex h-screen bg-gray-100">
         <Sidebar />
           <div className="flex-1 overflow-auto">
             <MemberHeader />
             <MemberContent />
           </div>
      </div>
    </div>
  );
}