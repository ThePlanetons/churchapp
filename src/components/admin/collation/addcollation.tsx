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
import CollectionTransactions from "../collection/collection-transaction";
import { z } from "zod";
import { X, Check, Trash } from "lucide-react";

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

interface Transaction {
  member: number | null;
  collection_type: string;
  collection_amount: string;
  transaction_date: string;
  transaction_type: string;

  id?: number;
}

type CollectionType = "Tithes" | "Mission" | "Partnership" | "Offering";

export function AddCollation({
  onClose,
  memberData
}: AddCollationProps) {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      date: "",
      collectFirstApprover: "",
      collectSecondApprover: "",
    },
  });

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

  // typeof memberSchema
  function onSubmit(values: z.infer<any>) {
    console.log("🚀 ~ onSubmit ~ values:", values)
  }

  // const onSubmit: SubmitHandler<FormValues> = async (data) => {
  //   if (!data.member || !data.date || !data.amount || !data.transaction_type) {
  //     toast({
  //       variant: "destructive",
  //       title: "Missing Information",
  //       description:
  //         "Please select a member and enter a date, amount and transaction type",
  //     });
  //     return;
  //   }
  // };

  // const displayTotalAmount = totalAmount ?? 0;

  const collectionTypes = ["Tithes", "Mission", "Partnership", "Offering"];
  const [selectedTab, setSelectedTab] = useState(collectionTypes[0]);  // Default to first tab

  const [savedEntries, setSavedEntries] = useState<Record<CollectionType, Transaction[]>>({
    Tithes: [],
    Mission: [],
    Partnership: [],
    Offering: [],
  });

  // Calculate individual totals
  const individualTotals = Object.fromEntries(
    Object.keys(savedEntries).map((key) => [
      key,
      savedEntries[key as CollectionType].reduce((sum, entry) => sum + Number(entry.collection_amount || 0), 0),
    ])
  );

  // Calculate grand total
  const grandTotal = Object.values(individualTotals).reduce((sum, total) => sum + total, 0);

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold text-center">
            {memberData ? "Edit Collation" : `New ${selectedTab} Entry`}
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="text-lg font-semibold">
              Total Amount: ${displayTotalAmount.toFixed(2)}
            </div> */}

            <Button type="button" onClick={onClose} variant="outline"><X /> Close</Button>

            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check /> {memberData ? 'Update' : 'Save'}</Button>

            {memberData && <Button type="button" variant="destructive"><Trash /> Delete</Button>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-5">
        <CollectionTransactions savedEntries={savedEntries} setSavedEntries={setSavedEntries}></CollectionTransactions>

        {/* Form */}
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-5">
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

        <div className="my-4 text-lg font-semibold">
          <h2 className="text-xl font-bold">Total Collection Amounts:</h2>
          <ul className="list-disc pl-6">
            {Object.entries(individualTotals).map(([category, total]) => (
              <li key={category}>
                {category}: <span className="font-bold text-primary">${total}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Display grand total */}
        <div className="text-xl font-bold">
          Grand Total: <span className="text-green-600">${grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
