import { useState } from "react";

import { Card } from "@/components/ui/card";
import UserList from "./user-list";
import UserAdd from "./user-add";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
}

export default function UserManagement() {
  const [view, setView] = useState<"list" | "add">("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <Card className="h-full">
      {view === "list" && (
        <UserList
          onAddUser={(userData) => {
            setSelectedUser(userData);
            setView("add");
          }}
        />
      )}
      {view === "add" && (
        <UserAdd onClose={() => setView("list")} userData={selectedUser} />
      )}
    </Card>
  );
}
