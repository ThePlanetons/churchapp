// import React, { useEffect, useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import AxiosInstance from "@/lib/axios";
// import { Button } from "@/components/ui/button";

// interface Member {
//   id: number;
//   first_name: string;
//   last_name: string;
//   entity: number;
//   dynamic_fields: Record<string, any>;
// }

// interface Entity {
//   id: number;
//   name: string;
// }

// interface AddCollationProps {
//   onClose: () => void;
//   memberData?: Member | null;
// }

// function AddCollation({ onClose, memberData }: AddCollationProps) {
//   const { toast } = useToast();
//   const [members, setMembers] = useState<Member[]>([]);
//   const [entities, setEntities] = useState<Entity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
//   const [selectedEntity, setSelectedEntity] = useState<string>("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");

//   const axiosInstance = AxiosInstance(toast);

//   const getUsername = (member: Member) => {
//     const usernameKey = Object.keys(member.dynamic_fields).find(key => 
//       key.startsWith('username_')
//     );
//     return usernameKey ? member.dynamic_fields[usernameKey] : 'N/A';
//   };

//   const getEntityName = (entityId: number) => {
//     const entity = entities.find(e => e.id === entityId);
//     return entity ? entity.name : 'N/A';
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [membersResponse, entitiesResponse] = await Promise.all([
//           axiosInstance.get("members/"),
//           axiosInstance.get("entities/")
//         ]);

//         setMembers(membersResponse.data || []);
//         setEntities(entitiesResponse.data || []);
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error loading data",
//           description: "Failed to fetch required information",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleMemberSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const memberId = Number(event.target.value);
//     setSelectedMemberId(memberId);

//     const member = members.find(m => m.id === memberId);
//     if (member) {
//       const entityName = getEntityName(member.entity);
//       setSelectedEntity(entityName);
//     }
//   };

//   const handleSubmit = () => {
//     if (!selectedMemberId || !amount) {
//       toast({
//         variant: "destructive",
//         title: "Missing Information",
//         description: "Please select a member and enter an amount",
//       });
//       return;
//     }

//     const formData = {
//       memberId: selectedMemberId,
//       entity: selectedEntity,
//       amount: parseFloat(amount),
//       message
//     };

//     console.log("Submitting collation:", formData);
//     onClose();
//   };

//   return (
//     <div className="space-y-4 p-4 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold text-gray-800">
//         {memberData ? "Edit Collation" : "New Collation Entry"}
//       </h2>

//       <div className="space-y-6">
//         {/* Member Selection */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Member Name
//           </label>
//           <select
//             value={selectedMemberId || ''}
//             onChange={handleMemberSelect}
//             disabled={loading}
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">{loading ? "Loading members..." : "Select a member"}</option>
//             {members.map((member) => (
//               <option key={member.id} value={member.id}>
//                 {getUsername(member)} ({member.first_name} {member.last_name})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Entity Display */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Associated Entity
//           </label>
//           <input
//             type="text"
//             value={selectedEntity}
//             readOnly
//             className="w-full p-2 border rounded-md bg-gray-50 cursor-not-allowed"
//           />
//         </div>

//         {/* Amount Input */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Amount
//           </label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="0.00"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             step="0.01"
//           />
//         </div>

//         {/* Message Input */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Message/Notes
//           </label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Additional information..."
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-6">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="px-6 py-2 border-gray-300"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {memberData ? "Save Changes" : "Create Collation"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddCollation;

import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AxiosInstance from "@/lib/axios";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  entity: number;
  dynamic_fields: Record<string, any>;
}

interface Entity {
  id: number;
  name: string;
}

interface AddCollationProps {
  onClose: () => void;
  memberData?: Member | null;
}

export function AddCollation({ onClose, memberData }: AddCollationProps) {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const axiosInstance = AxiosInstance(toast);

  const getUsername = (member: Member) => {
    const usernameKey = Object.keys(member.dynamic_fields).find(key =>
      key.startsWith('username_')
    );
    return usernameKey ? member.dynamic_fields[usernameKey] : 'N/A';
  };

  const getEntityName = (entityId: number) => {
    const entity = entities.find(e => e.id === entityId);
    return entity ? entity.name : 'N/A';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, entitiesResponse] = await Promise.all([
          axiosInstance.get("members/"),
          axiosInstance.get("entities/")
        ]);

        setMembers(membersResponse.data || []);
        setEntities(entitiesResponse.data || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to fetch required information",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMemberSelect = (value: string) => {
    const memberId = Number(value);
    setSelectedMemberId(memberId);

    const member = members.find(m => m.id === memberId);
    if (member) {
      const entityName = getEntityName(member.entity);
      setSelectedEntity(entityName);
    }
  };

  const handleSubmit = () => {
    if (!selectedMemberId || !amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a member and enter an amount",
      });
      return;
    }

    const formData = {
      memberId: selectedMemberId,
      entity: selectedEntity,
      amount: parseFloat(amount),
      message
    };

    console.log("Submitting collation:", formData);
    onClose();
  };

  return (
    <div className="space-y-6   ">
      <div className="flex flex-col justify-between px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">
            {memberData ? "Edit Collation" : "New Collation Entry"}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {memberData ? "Save Changes" : "Create Collation"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6">
        {/* Member Selection */}
        <div className="space-y-2">
          <Label htmlFor="member">Member Name</Label>
          <Select
            onValueChange={handleMemberSelect}
            disabled={loading}
            value={selectedMemberId?.toString() || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading members..." : "Select a member"} />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {getUsername(member)} ({member.first_name} {member.last_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entity Display */}
        <div className="space-y-2">
          <Label>Associated Entity</Label>
          <Input
            value={selectedEntity}
            readOnly
            className="bg-muted cursor-not-allowed"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Label htmlFor="message">Message/Notes</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Additional information..."
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}