import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"
import { Bolt, Pencil } from "lucide-react";

// MemberList component
function MemberList({ onAddMember }: { onAddMember: () => void }) {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/member/list/")
      .then((response) => {
        setMembers(response.data);
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      })
      .catch((error) => {
        console.error("Failed to fetch members:", error);
      });
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="text-xl font-semibold">Member List</div>

        <div className="flex flex-row gap-3">
          <Button onClick={onAddMember}>
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

// AddMember component
function AddMember({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/member/config/add/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Member added successfully!");
        onClose();
      })
      .catch((error) => {
        console.error("Failed to add member:", error);
        alert("Failed to add member. Please try again.");
      });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Add Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// Main component
export default function MemberManagement() {
  const [isAddingMember, setIsAddingMember] = useState(false);

  return (
    <div>
      {isAddingMember ? (
        <AddMember onClose={() => setIsAddingMember(false)} />
      ) : (
        <MemberList onAddMember={() => setIsAddingMember(true)} />
      )}
    </div>
  );
}
