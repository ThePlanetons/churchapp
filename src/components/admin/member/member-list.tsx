import { useEffect, useState } from "react";
import { Bolt, Pencil } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function MemberList({ onAddMember, onConfigureMember }: { onAddMember: () => void; onConfigureMember: () => void }) {
  const [members, setMembers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/member/list/")
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error,
        });
      });
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="text-xl font-semibold">Member List</div>

        <div className="flex flex-row gap-3">
          <Button onClick={onConfigureMember}>
            <Bolt /> Configure
          </Button>

          <Button onClick={onAddMember}>
            <Pencil />Add Member
          </Button>
        </div>
      </div>

      <ul className="space-y-2">
        {members.map((member: any) => (
          <li key={member.id} className="border rounded-md p-3">
            <p className="font-medium">{member.first_name} {member.last_name}</p>
            <p className="text-sm text-gray-600">{member.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;