import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface FormValues {
  member: string;
  associatedEntity: string;
  date: string;
  amount: string;
  collectFirstApprover: string;
  collectSecondApprover: string;
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

  const form = useForm<FormValues>({
    defaultValues: {
      member: "",
      associatedEntity: "",
      date: "",
      amount: "",
      collectFirstApprover: "",
      collectSecondApprover: "",
    },
  });

  // Manage the selected tab separately
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
  }, [axiosInstance, toast]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!data.member || !data.date || !data.amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a member and enter a date and amount",
      });
      return;
    }

    const formData = {
      memberId: Number(data.member),
      entity: data.associatedEntity,
      type: selectedTab,
      date: data.date,
      amount: parseFloat(data.amount),
      collect_first_approver: data.collectFirstApprover
        ? Number(data.collectFirstApprover)
        : null,
      collect_second_approve: data.collectSecondApprover
        ? Number(data.collectSecondApprover)
        : null,
    };

    console.log("Submitting collation:", formData);
    onClose();
  };

  const displayTotalAmount = totalAmount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        {/* Title */}

        {/* Action Row: Cancel on left; Total Amount & Submit on right */}
        <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-center ">
          {memberData ? "Edit Collation" : `New ${selectedTab} Entry`}
        </div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">
              Total Amount: ${displayTotalAmount.toFixed(2)}
            </div>
            <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              {memberData ? "Save Changes" : "Create Collation"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger
              value="Tithes"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Tithes
            </TabsTrigger>
            <TabsTrigger
              value="Mission"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Mission
            </TabsTrigger>
            <TabsTrigger
              value="Partnership"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Partnership
            </TabsTrigger>
            <TabsTrigger
              value="Offering"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Offering
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Form */}
      <div className="px-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Member & Associated Entity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="member"
                rules={{ required: "Member is required" }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Member Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) => {
                          field.onChange(value);
                          const memberId = Number(value);
                          const member = members.find((m) => m.id === memberId);
                          if (member) {
                            const entityName = getEntityName(member.entity);
                            form.setValue("associatedEntity", entityName);
                          }
                        }}
                        value={field.value}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loading ? "Loading members..." : "Select a member"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem
                              key={member.id}
                              value={member.id.toString()}
                            >
                              {getUsername(member)} (
                              {member.first_name} {member.last_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="associatedEntity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Entity</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        readOnly
                        className="bg-muted cursor-not-allowed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Date & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                rules={{ required: "Date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                rules={{ required: "Amount is required" }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>

            {/* Approvers (no border) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="collectFirstApprover"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Collect First Approver</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) => field.onChange(value)}
                        value={field.value}
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
                              {getUsername(member)} (
                              {member.first_name} {member.last_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collectSecondApprover"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Collect Second Approve</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) => field.onChange(value)}
                        value={field.value}
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
                              {getUsername(member)} (
                              {member.first_name} {member.last_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
