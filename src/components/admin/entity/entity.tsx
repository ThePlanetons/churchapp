import { useState } from "react";

import EntityList from "./entity-list";
import AddEntityMember from "./entity-add";

import { Card } from "@/components/ui/card";

export default function Entity() {
  const [view, setView] = useState("list");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <Card>
      {view === "list" && (
        <EntityList
          onAddMember={(memberData) => {
            setSelectedMember(memberData);
            setView("add");
          }}
          onConfigureMember={() => setView("configure")}
        />
      )}
      {view === "add" && (
        <AddEntityMember
          onClose={() => setView("list")}
          memberData={selectedMember} // Pass selected member data
        />
      )}

    </Card>
  );
}
