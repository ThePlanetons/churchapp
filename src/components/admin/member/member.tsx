import { useState } from "react";

import MemberList from "./member-list";
import AddMember from "./member-add";
import ConfigureMember from "./member-configure";

export default function App() {
  const [view, setView] = useState("list");

  return (
    <div className="container mx-auto py-6">
      {view === "list" && (
        <MemberList 
        onAddMember={() => setView("add")} 
        onConfigureMember={() => setView("configure")} 
      />
      )}
      {view === "add" && (
        <AddMember onClose={() => setView("list")} />
      )}
      {view === "configure" && (
        <ConfigureMember onClose={() => setView("list")} />
      )}
    </div>
  );
}
