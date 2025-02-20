import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box, CalendarIcon, Check, House, PanelsTopLeft, Trash, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { format } from "date-fns"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select"; // Import ShadCN Select components
import AxiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Transaction {
  member: number | null;
  collection_type: string;
  collection_amount: string;
  transaction_date: string;
  transaction_type: string;

  id?: number;
}

// const formSchema = z.object({
//   entries: z.array(
//     z.object({
//       transaction_date: z.string().nonempty("Transaction Date is required."),
//       transaction_type: z.string().min(1, "Transaction Type is required"),
//     })
//   )
// });

const formSchema = z.object({
  entries: z.record(
    z.enum(["Tithes", "Mission", "Partnership", "Offering"]),
    z.array(
      z.object({
        member: z.coerce.number({ invalid_type_error: "Member is required." }).min(1, "Member is required."),  // Ensure value is greater than 0
        collection_amount: z.string().nonempty("Transaction Amount is required."),
        transaction_date: z.string().nonempty("Transaction Date is required."),
        transaction_type: z.string().min(1, "Transaction Type is required"),
      })
    )
  )
});

type FormValues = z.infer<typeof formSchema>;
type CollectionType = "Tithes" | "Mission" | "Partnership" | "Offering";

export default function CollectionTransactions() {
  const { toast } = useToast();

  const [membersData, setMembers] = useState<any>(null);

  // Create the Axios instance with toast
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.MEMBERS)
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to member data. Please try again.",
        });
      });
  }, []);

  // const [savedEntries, setSavedEntries] = useState<FormValues["entries"]>([]);

  // const form = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     entries: [{
  //       transaction_date: "",
  //       transaction_type: "",
  //     }]
  //   }
  // });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "entries"
  // });

  // function onSubmitRow(index: number) {
  //   const rowValues = form.getValues().entries[index];
  //   setSavedEntries((prev) => [...prev, rowValues]);
  //   remove(index);

  //   if (fields.length === 1) {
  //     append({ transaction_date: "", transaction_type: "" });
  //   }
  // }

  const [savedEntries, setSavedEntries] = useState<Record<CollectionType, Transaction[]>>({
    Tithes: [],
    Mission: [],
    Partnership: [],
    Offering: []
  });

  const [activeTab, setActiveTab] = useState<CollectionType>("Tithes");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entries: {
        Tithes: [{ transaction_date: "", transaction_type: "" }],
        Mission: [],
        Partnership: [],
        Offering: []
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `entries.${activeTab}`
  });

  function onSubmitRow(index: number) {
    const entries = form.getValues().entries[activeTab] || []; // Ensure it exists
    const rowValues = entries[index];

    if (rowValues) {
      setSavedEntries((prev) => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), rowValues],
      }));
      remove(index);

      if (fields.length === 1) {
        append(
          {
            member: 0,
            collection_amount: "",
            transaction_date: "",
            transaction_type: ""
          }
        );
      }
    }
  }

  const transactionTypeOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "PayNow", label: "PayNow" },
    { value: "Others", label: "Others" },
  ];

  return (
    <div>
      <Tabs defaultValue="Tithes" onValueChange={(value) => setActiveTab(value as CollectionType)}>
        <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          {["Tithes", "Mission", "Partnership", "Offering"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {["Tithes", "Mission", "Partnership", "Offering"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Form {...form}>
              <form className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name={`entries.${activeTab}.${index}.member`}
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Member</FormLabel>

                          <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a member" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {membersData && membersData.map((member: any) => (
                                  <SelectItem key={member.id} value={String(member.id)}>
                                    {member.id} - {member.first_name} {member.last_name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`entries.${activeTab}.${index}.collection_amount`}
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Amount" {...field} />
                            {/* <Input type="number" placeholder="Amount" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} /> */}
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`entries.${activeTab}.${index}.transaction_date`}
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal w-full",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`entries.${activeTab}.${index}.transaction_type`}
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Transaction Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {transactionTypeOptions.map((transaction) => (
                                <SelectItem key={transaction.value} value={transaction.value}>
                                  {transaction.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Save Button for Each Row */}
                    <Button type="button" onClick={() => onSubmitRow(index)}>
                      Save
                    </Button>

                    {/* Delete Button */}
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button type="button" onClick={() => append({ member: 0, collection_amount: "", transaction_date: "", transaction_type: "" })}>
                  Add Entry
                </Button>
              </form>
            </Form>

            {/* Display Saved Entries */}
            {savedEntries[tab as CollectionType]?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Saved Entries</h2>
                <ul className="space-y-2">
                  {savedEntries[tab as CollectionType].map((entry, index) => (
                    <li key={index} className="p-2 border rounded-md">
                      <p><strong>Member:</strong> {entry.member}</p>
                      <p><strong>Collection Amount:</strong> {entry.collection_amount}</p>
                      <p><strong>Transaction Date:</strong> {entry.transaction_date}</p>
                      <p><strong>Transaction Type:</strong> {entry.transaction_type}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* <Form {...form}>
        <form className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name={`entries.${index}.transaction_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`entries.${index}.transaction_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transactionTypeOptions.map((transaction) => (
                          <SelectItem key={transaction.value} value={transaction.value}>
                            {transaction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" onClick={() => onSubmitRow(index)}>
                Save
              </Button>

              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
          }

          <Button type="button" onClick={() => append({ transaction_date: "", transaction_type: "" })}>
            Add Entry
          </Button>
        </form >
      </Form >

      {
        savedEntries.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Saved Entries</h2>
            <ul className="space-y-2">
              {savedEntries.map((entry, index) => (
                <li key={index} className="p-2 border rounded-md">
                  <p><strong>Category:</strong> {entry.transaction_date}</p>
                  <p><strong>Date:</strong> {entry.transaction_type}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      } */}
    </div >
  );
}