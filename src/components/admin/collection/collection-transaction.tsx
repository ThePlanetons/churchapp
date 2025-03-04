import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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

const formSchema = z.object({
  entries: z.record(
    z.enum(["Tithes", "Mission", "Partnership", "Offering"]),
    z.array(
      z.object({
        member: z.coerce.number({ invalid_type_error: "Member is required." }).min(1, "Member is required."),  // Ensure value is greater than 0
        collection_amount: z.coerce.number({ invalid_type_error: "Amount is required." }).min(1, "Amount must be greater than 0."),
        transaction_date: z.string().min(1, "Transaction Date is required."),
        transaction_type: z.string().min(1, "Transaction Type is required."),
      })
    )
  )
});

type FormValues = z.infer<typeof formSchema>;
type CollectionType = "Tithes" | "Mission" | "Partnership" | "Offering";

type CollectionTransactions = {
  savedEntries: Record<CollectionType, Transaction[]>;
  setSavedEntries: React.Dispatch<React.SetStateAction<Record<CollectionType, Transaction[]>>>;
  activeTab: CollectionType;
  setActiveTab: React.Dispatch<React.SetStateAction<CollectionType>>;
};

export default function CollectionTransactions({
  savedEntries, setSavedEntries, activeTab, setActiveTab
}: CollectionTransactions) {
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
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to member data. Please try again.",
        });
      });
  }, []);

  // const [savedEntries, setSavedEntries] = useState<Record<CollectionType, Transaction[]>>({
  //   Tithes: [],
  //   Mission: [],
  //   Partnership: [],
  //   Offering: []
  // });

  // const [activeTab, setActiveTab] = useState<CollectionType>("Tithes");

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

  async function onSubmitRow(index: number) {
    const isValid = await form.trigger(`entries.${activeTab}.${index}`);

    if (!isValid) return;

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
            collection_amount: 0,
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

  // 1st table - collcetion_master
  // id
  // collect_amount
  // collect_date
  // collect_total_amount
  // collect_first_approver
  // collect_second_approver

  // 2nd table - collection_detail
  // id
  // collection_id - this match key column in collection master
  // collection_type
  // collection_amount
  // transaction_date
  // transaction_type
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <Tabs defaultValue="Tithes" onValueChange={(value) => setActiveTab(value as CollectionType)}>
        <div className="flex flex-row items-center justify-between">
          <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
            {["Tithes", "Mission", "Partnership", "Offering"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div>
            Total <span className="font-semibold">{activeTab}</span> Amount: <span className="font-bold">${savedEntries[activeTab]?.reduce((total, entry) => total + Number(entry.collection_amount || 0), 0)}</span>
          </div>
        </div>

        {["Tithes", "Mission", "Partnership", "Offering"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Form {...form}>
              <form className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-4 border rounded-md shadow-md bg-stone-100 p-3">
                    <div className="w-[90%] flex space-x-4">
                      <FormField
                        control={form.control}
                        name={`entries.${activeTab}.${index}.member`}
                        render={({ field }) => (
                          <FormItem className="w-1/4">
                            <FormLabel>Member</FormLabel>

                            <Select
                              onValueChange={(value) => { field.onChange(value); form.trigger(field.name) }}
                              value={field.value ? String(field.value) : ""}>
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
                          <FormItem className="w-1/4">
                            <FormLabel>Amount</FormLabel>

                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Amount"
                                // value={field.value as string}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  form.trigger(field.name);
                                }}
                                onBlur={() => form.trigger(field.name)}
                              />
                              {/* <Input type="number" placeholder="Amount" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} /> */}
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`entries.${activeTab}.${index}.transaction_date`}
                        render={({ field }) => (
                          <FormItem className="w-1/4">
                            <FormLabel>Transaction Date</FormLabel>

                            <Popover open={openIndex === index} onOpenChange={(isOpen) => setOpenIndex(isOpen ? index : null)}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal w-full",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    onClick={() => setOpenIndex(index)}
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
                                  onSelect={(date) => {
                                    field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                    form.trigger(field.name);
                                    setOpenIndex(null)
                                  }}
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
                          <FormItem className="w-1/4">
                            <FormLabel>Transaction Type</FormLabel>

                            <Select
                              onValueChange={(value) => { field.onChange(value); form.trigger(field.name) }}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a transaction type" />
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
                    </div>

                    <div className="space-x-4 flex justify-end">
                      <Button type="button" onClick={() => onSubmitRow(index)}>
                        <Check className="h-4 w-4" />
                      </Button>

                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button type="button" onClick={() => append({ member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" })}>
                    Add Entry
                  </Button>
                </div>
              </form>
            </Form>

            {/* Display Saved Entries */}
            {savedEntries[tab as CollectionType]?.length > 0 && (
              <div className="mt-5">
                <div className="text-lg font-semibold mb-4 text-primary">Saved Entries</div>

                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-primary/10 text-primary uppercase tracking-wide">
                        <th className="p-3 border">#</th>
                        <th className="p-3 border">Member</th>
                        <th className="p-3 border">Collection Amount</th>
                        <th className="p-3 border">Transaction Date</th>
                        <th className="p-3 border">Transaction Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedEntries[tab as CollectionType].map((entry, index) => (
                        <tr key={index} className="hover:bg-primary/5 transition-colors">
                          <td className="p-3 border text-center font-semibold">{index + 1}</td>
                          <td className="p-3 border">{entry.member}</td>
                          <td className="p-3 border">${entry.collection_amount}</td>
                          <td className="p-3 border">{entry.transaction_date}</td>
                          <td className="p-3 border">{entry.transaction_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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