import { useState } from "react";

import MemberList from "./member-list";
import AddMember from "./member-add";
import ConfigureMember from "./member-configure";

export default function MemberManagement() {
  const [view, setView] = useState("list");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <div className="h-full border rounded-md shadow-md bg-white">
      {view === "list" && (
        <MemberList
          onAddMember={(memberData) => {
            setSelectedMember(memberData);
            setView("add");
          }}
          onConfigureMember={() => setView("configure")}
        />
      )}
      {view === "add" && (
        <AddMember
          onClose={() => setView("list")}
          memberData={selectedMember}  // Pass selected member data
        />
      )}
      {view === "configure" && (
        <ConfigureMember onClose={() => setView("list")} />
      )}
    </div>
  );
}
