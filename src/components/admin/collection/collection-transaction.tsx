import { forwardRef, useEffect, useMemo, useState, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { format } from "date-fns"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select"; // Import ShadCN Select components
import AxiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { TransitionPanel } from "@/components/motion-primitives/transition-panel";

import { AnimatePresence, motion } from "framer-motion"
import { GooeyFilter } from "@/components/ui/gooey-filter"

import { useScreenSize } from "@/hooks/use-screen-size";

interface Transaction {
  member: number;
  collection_type: string;
  collection_amount: string;
  transaction_date: string;
  transaction_type: string;

  id?: number;
  member_name?: string;
  is_new?: boolean;
  is_edit?: boolean;
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

        member_name: z.string().optional(),
        is_new: z.boolean().optional(),
        is_edit: z.boolean().optional(),
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

interface CollectionTransactionsProps {
  savedEntries: Record<CollectionType, Transaction[]>;
  setSavedEntries: React.Dispatch<React.SetStateAction<Record<CollectionType, Transaction[]>>>;
  activeTab: CollectionType;
  setActiveTab: React.Dispatch<React.SetStateAction<CollectionType>>;
}

// Define the exposed methods
export interface CollectionTransactionsRef {
  checkUnsavedChanges: () => boolean;
  resetForm: () => void;
}

const CollectionTransactions = forwardRef<CollectionTransactionsRef, CollectionTransactionsProps>(
  ({ savedEntries, setSavedEntries, activeTab, setActiveTab }, ref) => {

    const { toast } = useToast();

    const [membersData, setMembers] = useState<any>([]);

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

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        entries: {
          Tithes: [{ member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" }],
          Mission: [{ member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" }],
          Partnership: [{ member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" }],
          Offering: [{ member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" }]
        }
      },
      // mode: "onChange",
    });

    useEffect(() => {
      const updatedEntries = { ...form.getValues("entries") };

      (["Tithes", "Mission", "Partnership", "Offering"] as CollectionType[]).forEach((tab) => {
        if (!updatedEntries[tab] || updatedEntries[tab].length === 0) {
          updatedEntries[tab] = [
            { member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" },
          ];
        }
      });

      form.reset({ entries: updatedEntries }); // Reset form to ensure proper re-render
    }, []);

    const fields = form.watch(`entries.${activeTab}`) || [];

    const onSubmitRow = (index: number) => {
      const currentEntries = form.getValues(`entries.${activeTab}`) || [];

      // Get the entry being submitted
      const entryToSubmit = currentEntries[index];

      if (!entryToSubmit) return;

      // Ensure savedEntries exists for the active tab
      setSavedEntries((prev) => ({
        ...prev,
        [activeTab]: [
          ...(prev[activeTab] || []),
          { ...entryToSubmit, is_new: true },
        ],
      }));

      // Remove the submitted row from form state
      const updatedEntries = currentEntries.filter((_, i) => i !== index);

      // If no rows remain, add a new empty row
      if (updatedEntries.length === 0) {
        updatedEntries.push({ member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" });
      }

      form.setValue(`entries.${activeTab}`, updatedEntries);
      // form.trigger(`entries.${activeTab}`);
      form.clearErrors(`entries.${activeTab}`); // Clear errors to prevent validation messages
    };

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

    const onDeleteRow = (tab: CollectionType, index: number) => {
      setSavedEntries((prev) => ({
        ...prev,
        [tab]: prev[tab].filter((_, i) => i !== index), // Remove the entry by index
      }));
    };

    const onEditRow = (tab: CollectionType, index: number) => {
      const entryToEdit = savedEntries[tab][index];

      if (!entryToEdit) return;

      const currentEntries = form.getValues(`entries.${tab}`) || [];

      form.setValue(`entries.${tab}`, [
        ...currentEntries,
        {
          ...entryToEdit,
          collection_amount: Number(entryToEdit.collection_amount), // Ensure number type
          is_edit: true,
        },
      ]);

      // form.trigger(`entries.${tab}`);

      // Remove the entry from savedEntries
      setSavedEntries((prevEntries) => ({
        ...prevEntries,
        [tab]: prevEntries[tab].filter((_, i) => i !== index), // Remove item by index
      }));
    };

    // Expose methods to the parent
    useImperativeHandle(ref, () => ({
      checkUnsavedChanges: () => {
        // const isFormDirty = form.formState.isDirty;
        const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;

        const hasEditableEntries = Object.values(form.getValues("entries")).some(
          (entries) => entries.some((entry) => entry.is_edit)
        );

        const hasUnsavedEntries = Object.values(savedEntries).some(
          (entries) => entries.some((entry) => entry.is_new)
        );

        return isFormDirty || hasEditableEntries || hasUnsavedEntries; // Returns true if there are unsaved changes
      },

      resetForm: () => {
        form.reset();
      },
    }));

    const collectionTypes: CollectionType[] = ["Tithes", "Mission", "Partnership", "Offering"];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const isGooeyEnabled = true;
    const screenSize = useScreenSize();

    return (
      <div className="min-h-screen overflow-auto">
        <div className="w-full h-full flex justify-center font-calendas md:text-base text-xs sm:text-sm bg-white dark:bg-black">
          <GooeyFilter
            id="gooey-filter"
            strength={screenSize.lessThan("md") ? 8 : 15}
          />

          <div className="w-full relative">
            <div
              className="absolute inset-0"
              style={{ filter: isGooeyEnabled ? "url(#gooey-filter)" : "none" }}
            >
              <div className="flex w-full">
                {collectionTypes.map((tab) => (
                  <div key={tab} className="relative flex-1 h-8 md:h-12">
                    {activeTab === tab && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-[#efefef]"
                        transition={{
                          type: "spring",
                          bounce: 0.0,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Content panel */}
              <div className="w-full bg-[#efefef] overflow-hidden text-muted-foreground">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeTab}
                    initial={{
                      opacity: 0,
                      y: 50,
                      filter: "blur(10px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -50,
                      filter: "blur(10px)",
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="p-5"
                  >
                    <div className="space-y-4">
                      <Form {...form}>
                        <form className="space-y-4">
                          {fields.map((_, index) => (
                            <div key={index} className="flex items-center space-x-4 border rounded-md bg-white shadow-md p-3">
                              <div className="w-[90%] flex space-x-4">
                                <FormField
                                  control={form.control}
                                  name={`entries.${activeTab}.${index}.member`}
                                  render={({ field }) => (
                                    <FormItem className="w-1/4">
                                      <FormLabel>Member</FormLabel>

                                      <Select
                                        onValueChange={(value) => {
                                          const selectedMember = membersData.find((member: any) => String(member.id) === value);

                                          field.onChange(value);
                                          form.setValue(`entries.${activeTab}.${index}.member_name`, selectedMember ? `${selectedMember.first_name} ${selectedMember.last_name}` : "");
                                          form.trigger(field.name);
                                        }}
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
                                          value={field.value !== undefined ? field.value : ""}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            form.trigger(field.name);
                                          }}
                                          onBlur={() => form.trigger(field.name)}
                                        />
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
                                <Button type="button"
                                  onClick={async () => {
                                    const isValid = await form.trigger(`entries.${activeTab}.${index}`);
                                    if (isValid) {
                                      onSubmitRow(index);
                                    }
                                  }}>
                                  <Check className="h-4 w-4" />
                                </Button>

                                <Button type="button" variant="destructive"
                                  onClick={() => {
                                    const currentEntries = form.getValues(`entries.${activeTab}`) || [];

                                    // Remove the item at the given index
                                    const updatedEntries = currentEntries.filter((_, i) => i !== index);

                                    form.setValue(`entries.${activeTab}`, updatedEntries);
                                    form.trigger(`entries.${activeTab}`);
                                  }}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <div className="flex justify-end">
                            <Button
                              type="button"
                              onClick={() => {
                                const currentEntries = form.getValues(`entries.${activeTab}`) || [];

                                form.setValue(`entries.${activeTab}`, [
                                  ...currentEntries,
                                  { member: 0, collection_amount: 0, transaction_date: "", transaction_type: "" }
                                ]);

                                form.clearErrors(`entries.${activeTab}`); // Clear errors to prevent validation messages
                                // form.trigger(`entries.${activeTab}`); // Ensure validation updates
                              }}
                            >
                              Add Entry
                            </Button>
                          </div>
                        </form>
                      </Form>

                      {/* Display Saved Entries */}
                      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                        <table className="w-full border-collapse text-left text-sm">
                          <thead>
                            <tr className="bg-primary/10 text-primary uppercase tracking-wide">
                              <th className="p-3 border">#</th>
                              <th className="p-3 border">Member</th>
                              <th className="p-3 border">Collection Amount</th>
                              <th className="p-3 border">Transaction Date</th>
                              <th className="p-3 border">Transaction Type</th>
                              <th className="p-3 border text-center">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {savedEntries[activeTab]?.length > 0 ? (
                              savedEntries[activeTab].map((entry, index) => (
                                <tr key={index} className="hover:bg-primary/5 transition-colors">
                                  <td className="p-3 border text-center font-semibold">{index + 1}</td>
                                  <td className="p-3 border">{entry.member_name}</td>
                                  <td className="p-3 border">${entry.collection_amount}</td>
                                  <td className="p-3 border">{entry.transaction_date}</td>
                                  <td className="p-3 border">{entry.transaction_type}</td>
                                  <td className="p-3 border text-center space-x-4">
                                    <Button type="button"
                                      onClick={() => onEditRow(activeTab as CollectionType, index)}
                                    >
                                      Edit
                                    </Button>
                                    <Button type="button" variant="destructive"
                                      onClick={() => onDeleteRow(activeTab as CollectionType, index)}
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="p-8 text-center text-bold text-lg">
                                  No entries found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive text overlay, no filter */}
            <div className="relative flex w-full">
              {collectionTypes.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 h-8 md:h-12"
                >
                  <span
                    className={`
                        w-full h-full flex items-center justify-center
                        ${activeTab === tab ? "text-black" : "text-muted-foreground"}
                      `}
                  >
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CollectionTransactions;