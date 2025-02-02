import { useState } from "react";

import { Card } from "@/components/ui/card";
import EntityList from "./entity-list";
import EntityAdd from "./entity-add";

export default function Entity() {
  const [view, setView] = useState("list");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <Card className="h-full">
      {view === "list" && (
        <EntityList
          onAddMember={(memberData) => {
            setSelectedMember(memberData);
            setView("add");
          }}
        />
      )}
      {view === "add" && (
        <EntityAdd
          onClose={() => setView("list")}
          memberData={selectedMember}  // Pass selected member data
        />
      )}

    </Card>
  );
}
