import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  totalAmount?: number; // Total amount in the fund
}

export function AddCollation({
  onClose,
  memberData,
  totalAmount,
}: AddCollationProps) {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // New state variables for approver fields (store selected member IDs)
  const [collectFirstApprover, setCollectFirstApprover] = useState<number | null>(null);
  const [collectSecondApprover, setCollectSecondApprover] = useState<number | null>(null);

  // New state to manage the active tab
  const [selectedTab, setSelectedTab] = useState("Tithes");

  const axiosInstance = AxiosInstance(toast);

  const getUsername = (member: Member) => {
    const usernameKey = Object.keys(member.dynamic_fields).find((key) =>
      key.startsWith("username_")
    );
    return usernameKey ? member.dynamic_fields[usernameKey] : "N/A";
  };

  const getEntityName = (entityId: number) => {
    const entity = entities.find((e) => e.id === entityId);
    return entity ? entity.name : "N/A";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, entitiesResponse] = await Promise.all([
          axiosInstance.get("members/"),
          axiosInstance.get("entities/"),
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

    const member = members.find((m) => m.id === memberId);
    if (member) {
      const entityName = getEntityName(member.entity);
      setSelectedEntity(entityName);
    }
  };

  const handleSubmit = () => {
    if (!selectedMemberId || !date || !amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a member and enter a date and amount",
      });
      return;
    }

    const formData = {
      memberId: selectedMemberId,
      entity: selectedEntity,
      type: selectedTab,
      date,
      amount: parseFloat(amount),
      collect_first_approver: collectFirstApprover,
      collect_second_approve: collectSecondApprover,
    };

    console.log("Submitting collation:", formData);
    onClose();
  };

  // Use the provided totalAmount or default to 0
  const displayTotalAmount = totalAmount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">
            {memberData ? "Edit Collation" : `New ${selectedTab} Entry`}
          </div>
          <div className="flex gap-4 items-center">
          <div className="text-lg font-semibold">
              Total Amount: ${displayTotalAmount.toFixed(2)}
            </div>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {memberData ? "Save Changes" : "Create Collation"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex space-x-4 border-b mb-4">
          {["Tithes", "Mission", "Partnership", "Offering"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-4 -mb-px border-b-2 font-medium ${
                selectedTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 px-6">
        {/* Member Name and Associated Entity in one row */}
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="member">Member Name</Label>
            <Select
              onValueChange={handleMemberSelect}
              disabled={loading}
              value={selectedMemberId?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loading ? "Loading members..." : "Select a member"}
                />
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

          <div className="flex-1 space-y-2">
            <Label>Associated Entity</Label>
            <Input
              value={selectedEntity}
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>
        </div>

        {/* Container for Date and Amount on the same line (without border) */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
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
          </div>
        </div>

        {/* Box for Collect First Approver and Collect Second Approve using dropdowns */}
        <div className="p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* Collect First Approver Dropdown */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="collect_first_approver">
                Collect First Approver
              </Label>
              <Select
                onValueChange={(value: string) =>
                  setCollectFirstApprover(Number(value))
                }
                value={
                  collectFirstApprover ? collectFirstApprover.toString() : ""
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first approver" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id.toString()}
                    >
                      {getUsername(member)} ({member.first_name} {member.last_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Collect Second Approve Dropdown */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="collect_second_approve">
                Collect Second Approve
              </Label>
              <Select
                onValueChange={(value: string) =>
                  setCollectSecondApprover(Number(value))
                }
                value={
                  collectSecondApprover ? collectSecondApprover.toString() : ""
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second approver" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id.toString()}
                    >
                      {getUsername(member)} ({member.first_name} {member.last_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
