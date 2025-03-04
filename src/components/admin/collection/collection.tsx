import { useState } from "react";

import { Card } from "@/components/ui/card";
import  { AddCollation }  from "./collection-add";
import CollationList from "./collection-list";

export default function Collation() {
  const [view, setView] = useState("list");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <Card className="h-full">
      {view === "list" && (
        <CollationList
          onAddMember={(memberData) => {
            setSelectedMember(memberData);
            setView("add");
          }}
          // onConfigureMember={() => setView("configure")}
        />
      )}
      {view === "add" && (
        <AddCollation
          onClose={() => setView("list")}
          memberData={selectedMember}  // Pass selected member data
        />
      )}
      {/* {view === "configure" && (
        <ConfigureMember onClose={() => setView("list")} />
      )} */}
    </Card>
  );
}
