import React, { useEffect, useMemo, useState } from "react";
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
  transaction_type: string; // New transaction type field
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
      transaction_type: "",
      collectFirstApprover: "",
      collectSecondApprover: "",
    },
  });

  // Manage the selected tab separately
  const [selectedTab, setSelectedTab] = useState("Tithes");

  // Memoize your axios instance to include toast for error handling if needed
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.member || !data.date || !data.amount || !data.transaction_type) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please select a member and enter a date, amount and transaction type",
      });
      return;
    }

    // Build the request body using the required parameter names
    const requestBody = {
      collection_type: selectedTab.toLowerCase(), // e.g., "tithes", "mission", etc.
      collection_amount: parseFloat(data.amount),
      transaction_date: data.date,
      transaction_type: data.transaction_type,
      created_by: localStorage.getItem("name"),
      member: Number(data.member),
    };

    // Config object for the POST request
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      // Send the POST request to the collections endpoint
      const response = await axiosInstance.post(
        "http://127.0.0.1:8000/api/collections/",
        requestBody,
        config
      );
      console.log("Collection created:", response.data);
      toast({
        title: "Collection Created",
        description: "The collection has been successfully created.",
      });
      onClose();
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error creating the collection. Please try again.",
      });
    }
  };

  const displayTotalAmount = totalAmount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-center">
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
                          const member = members.find(
                            (m) => m.id === memberId
                          );
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
                              loading
                                ? "Loading members..."
                                : "Select a member"
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

            {/* Transaction Details (Common Fields) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name="transaction_type"
                rules={{ required: "Transaction Type is required" }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="paynow">PayNow</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-7 py-3 border ">
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
                    <FormLabel>Collect Second Approver</FormLabel>
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
