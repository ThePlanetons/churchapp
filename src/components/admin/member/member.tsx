import { useState } from "react";

import MemberList from "./member-list";
import AddMember from "./member-add";
import ConfigureMember from "./member-configure";
import { Card } from "@/components/ui/card";

export default function MemberManagement() {
  const [view, setView] = useState("list");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <Card>
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
          memberData={selectedMember} // Pass selected member data
        />
      )}
      {view === "configure" && (
        <ConfigureMember onClose={() => setView("list")} />
      )}
    </Card>
  );
}
