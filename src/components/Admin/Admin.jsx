import { Dashboard } from "./Dashboard/Dashboard";
import { Member } from "./Member/Member";

export function Admin() {
  return (
    <div className='flex flex-row'>
      {/* <Dashboard /> */}

      <Member />
    </div>
  );
}