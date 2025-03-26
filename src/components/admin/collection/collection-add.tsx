import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AxiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { CalendarIcon, CircleAlertIcon, X, Check, Trash, Pencil } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

import CollectionTransactions, { CollectionTransactionsRef } from "./collection-transaction";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CalendarOriginUI from "@/components/ui/calendar-origin-ui";
import DeleteConfirmationDialog from "../delete-confirmation";
import { zodResolver } from "@hookform/resolvers/zod";

import { AnimatePresence, motion } from "framer-motion"
import { GooeyFilter } from "@/components/ui/gooey-filter"

import { useScreenSize } from "@/hooks/use-screen-size";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  entity: number;
  dynamic_fields: Record<string, any>;
}

interface Transaction {
  member: number;
  collection_type: string;
  collection_amount: string;
  transaction_date: string;
  transaction_type: string;

  id?: number;
  member_name?: string;
  is_new?: boolean;
}

type CollectionType = "Tithes" | "Mission" | "Partnership" | "Offering" | "Normal";

type CollectionDataType = {
  date: string;
  first_approver: number;
  second_approver: number;
  first_approver_name: string;
  second_approver_name: string;
  transactions: {
    Tithes?: any[];
    Mission?: any[];
    Partnership?: any[];
    Offering?: any[];
    Normal?: any[];
  };
};

const formSchema = z.object({
  date: z.string().nonempty("Date is required."),
  first_approver: z.coerce.number({ invalid_type_error: "First Approver is required." }).min(1, "First Approver is required."),  // Ensure value is greater than 0
  second_approver: z.coerce.number({ invalid_type_error: "Second Approver is required." }).min(1, "Second Approver is required."),  // Ensure value is greater than 0
});

export function CollectionAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [members, setMembers] = useState<Member[]>([]);

  const [savedEntries, setSavedEntries] = useState<Record<CollectionType, Transaction[]>>({
    Tithes: [],
    Mission: [],
    Partnership: [],
    Offering: [],
    Normal: [],
  });

  // Memoize your axios instance to include toast for error handling if needed
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.MEMBERS)
      .then((response) => {
        setMembers(response.data);
        // console.log(members)
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to member data. Please try again.",
        });
      });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      first_approver: 0,
      second_approver: 0,
    },
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [membersResponse] = await Promise.all([
  //         axiosInstance.get("members/"),
  //         axiosInstance.get("entities/"),
  //       ]);

  //       setMembers(membersResponse.data || []);
  //     } catch (error) {
  //       toast({
  //         variant: "destructive",
  //         title: "Error loading data",
  //         description: "Failed to fetch required information",
  //       });
  //     } finally {
  //     }
  //   };

  //   fetchData();
  // }, [axiosInstance, toast]);

  useEffect(() => {
    if (id) {
      fetchCollection(id);
    }
  }, [id]);

  const [collectionData, setCollectionData] = useState<CollectionDataType | null>(null);

  const fetchCollection = async (id: string) => {
    try {
      // setLoading(true);
      const { data } = await axiosInstance.get(`/collections/${id}`);
      setCollectionData(data);

      form.setValue("date", data.date);
      form.setValue("first_approver", data.first_approver);
      form.setValue("second_approver", data.second_approver);

      setSavedEntries((prevEntries) => ({
        Tithes: Array.isArray(data.transactions.Tithes) ? data.transactions.Tithes : prevEntries.Tithes,
        Mission: Array.isArray(data.transactions.Mission) ? data.transactions.Mission : prevEntries.Mission,
        Partnership: Array.isArray(data.transactions.Partnership) ? data.transactions.Partnership : prevEntries.Partnership,
        Offering: Array.isArray(data.transactions.Offering) ? data.transactions.Offering : prevEntries.Offering,
        Normal: Array.isArray(data.transactions.Normal) ? data.transactions.Normal : prevEntries.Normal
      }));
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (members.length > 0) {
      form.setValue("first_approver", collectionData?.first_approver ?? 0);
      form.setValue("second_approver", collectionData?.second_approver ?? 0);
    }
  }, [members]);

  function onSubmit(values: z.infer<any>) {
    const name = localStorage.getItem("name");

    id ? values.updated_by = name : values.created_by = name;

    const requestData = {
      ...values,
      ...savedEntries,
    };

    const request = id
      ? axiosInstance.put(`${API_ENDPOINTS.COLLECTIONS}save_collection/${id}/`, requestData)
      : axiosInstance.post(`${API_ENDPOINTS.COLLECTIONS}save_collection/`, requestData);

    request
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: id
            ? "Collection updated successfully!"
            : "Collection added successfully!",
        });

        onClose();
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add/update collection. Please try again.",
        });
      });
  }

  const onClose = () => {
    navigate(`/admin/collections/`);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const transactionRef = useRef<CollectionTransactionsRef>(null);

  // function handleClose() {
  //   if (transactionRef.current?.checkUnsavedChanges()) {
  //     setIsDialogOpen(true);

  //   } else {
  //     transactionRef.current?.resetForm(); // Reset the form before closing

  //     onClose();
  //   }
  // }

  function handleClose() {
    console.log("🚀 ~ handleClose ~ isViewMode:", isViewMode)
    if (isViewMode) {
      setIsViewMode(false); // Switch to edit mode if in view mode
    } else {
      if (transactionRef.current?.checkUnsavedChanges()) {
        setIsDialogOpen(true);
      } else {
        transactionRef.current?.resetForm(); // Reset the form before closing

        if (id) {
          setIsViewMode(true); // Ensure it goes back to view mode
        } else {
          onClose();
        }
      }
    }
  }

  const collectionTypes = ["Tithes", "Mission", "Partnership", "Offering", "Normal"];
  const [activeTab, setActiveTab] = useState<CollectionType>("Tithes");

  // Calculate individual totals
  const individualTotals = Object.fromEntries(
    Object.keys(savedEntries).map((key) => [
      key,
      savedEntries[key as CollectionType].reduce((sum, entry) => sum + Number(entry.collection_amount || 0), 0),
    ])
  );

  // Calculate grand total
  const grandTotal = Object.values(individualTotals).reduce((sum, total) => sum + total, 0);

  const [openOrigin, setOpenOrigin] = useState(false);

  // For delete functionality
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const toggleDeleteDialog = () => {
    setDeleteDialogOpen((prev) => !prev);
  };

  const handleDelete = () => {
    axiosInstance.delete(`collections/${id}/`)
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Collection deleted successfully!",
        });

        onClose();
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error deleting collection",
        });
      })
      .finally(
        () => {
          // setLoading(false);
        }
      );
    toggleDeleteDialog();
  };

  const [isViewMode, setIsViewMode] = useState(!!id);
  const isGooeyEnabled = true;
  const screenSize = useScreenSize();

  useEffect(() => {
    console.log(isViewMode)
  }, [isViewMode]);

  return (
    <>
      {isViewMode ?
        <div>
          {/* Header */}
          <div className="relative px-4 py-3 border-b">
            <div className="flex justify-between items-center w-full">
              <div className="text-2xl font-bold text-center">
                {`View Collection - ${activeTab}`}
              </div>

              <div className="flex items-center gap-3">
                <Button type="button" onClick={onClose} variant="outline"><X /> Close</Button>

                <Button type="button" onClick={() => setIsViewMode(false)}><Pencil /> Edit</Button>
              </div>
            </div>
          </div>

          {/* Display grand total */}
          <div className="flex gap-1 justify-center text-xl font-bold my-5">
            Grand Total: <span className="text-green-600">${grandTotal}</span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Date */}
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-lg font-semibold">
                {form.getValues("date") ? format(new Date(form.getValues("date")), "PPP") : "N/A"}
              </p>
            </div>

            {/* First Approver */}
            <div>
              <p className="text-sm font-medium text-gray-500">First Approver</p>
              <p className="text-lg font-semibold">
                {collectionData?.first_approver_name}
              </p>
            </div>

            {/* Second Approver */}
            <div>
              <p className="text-sm font-medium text-gray-500">Second Approver</p>
              <p className="text-lg font-semibold">
                {collectionData?.second_approver_name}
              </p>
            </div>
          </div>


          <div className="my-5">
            <div className="mx-auto flex justify-center gap-3 w-full max-w-xs bg-transparent">
              {collectionTypes.map((tab) => (
                <Card
                  key={tab}
                  className={`group flex flex-col items-center justify-center p-3 shadow-none border-primary cursor-pointer transition-all min-w-[140px] flex-1 ${activeTab === tab ? "bg-primary/70 border-none text-white" : ""}`}
                >
                  <div className="font-semibold">{tab}</div>

                  <div className="mt-0.5 text-lg font-bold group-[.active]:text-white">
                    ${individualTotals[tab] || 0}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="min-h-screen overflow-auto border-4 rounded-[36px] border-primary">
            <div className="w-full h-full flex justify-center font-calendas md:text-base text-xs sm:text-sm bg-white dark:bg-black">
              <GooeyFilter
                id="gooey-filter"
                strength={screenSize.lessThan("md") ? 8 : 15}
              />

              <div className="w-full relative h-full">
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
                  <div className="w-full bg-[#efefef] overflow-hidden">
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
                      onClick={() => setActiveTab(tab as CollectionType)}
                      className="flex-1 h-8 md:h-12"
                    >
                      <span
                        className={`
                          w-full h-full flex items-center justify-center font-semibold tracking-wider
                          ${activeTab === tab ? "text-black" : ""}
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
        </div>
        :
        <div>
          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => toggleDeleteDialog()}
            onConfirm={handleDelete}
            title="Are you absolutely sure?"
            description="This action cannot be undone. Are you sure you want to permanently delete this member from our servers?"
          />

          {/* Header */}
          <div className="relative px-4 py-3 border-b">
            <div className="flex justify-between items-center w-full">
              <div className="text-2xl font-bold text-center">
                {id ? `Edit Collection - ${activeTab}` : `Add Collection - ${activeTab}`}
              </div>

              <div className="flex items-center gap-3">
                {id ? (
                  <Button type="button" onClick={handleClose} variant="outline">
                    <X /> Cancel
                  </Button>
                ) : (
                  <Button type="button" onClick={handleClose} variant="outline">
                    <X /> Close
                  </Button>
                )}

                <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check /> Save</Button>

                {id && <Button type="button" variant="destructive" onClick={() => toggleDeleteDialog()}>
                  <Trash size={16} strokeWidth={2} aria-hidden="true" />
                  Delete
                </Button>}
              </div>
            </div>
          </div>

          <div className="p-5">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {/* <AlertDialogOverlay className="bg-black/10" /> */}
              <AlertDialogContent className="bg-white shadow-lg">
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>

                  <AlertDialogHeader>
                    <AlertDialogTitle>Unsaved Changes Detected</AlertDialogTitle>
                    <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to leave without saving?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    // setIsDialogOpen(false);
                    console.log(isViewMode)
                    if (isViewMode) {
                      // setIsViewMode(true); // Switch to edit mode
                    } else {
                      if (id) {
                      setIsViewMode(true); // Switch to edit mode
                    } else {
                      onClose(); // Close if already in edit mode
                    }
                    }
                  }}
                  >
                    Yes, Close
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Display grand total */}
            <div className="flex gap-1 justify-center text-xl font-bold mb-5">
              Grand Total: <span className="text-green-600">${grandTotal}</span>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-5">
                  {id ?
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-lg font-semibold">
                        {form.getValues("date") ? format(new Date(form.getValues("date")), "PPP") : "N/A"}
                      </p>
                    </div>
                    :
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>

                          <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
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
                              <CalendarOriginUI
                                value={field.value ? new Date(field.value) : undefined} // Convert string to Date
                                onChange={(date) => {
                                  field.onChange(date || "");
                                  setOpenOrigin(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  }

                  <FormField
                    control={form.control}
                    name="first_approver"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="col-start-1">
                        <FormLabel>First Approver</FormLabel>

                        {/* <Select
                      onValueChange={(value: string) => field.onChange(value)}
                      value={field.value ? String(field.value) : ""}
                    > */}
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convert back to number
                          value={field.value ? String(field.value) : ""} // Convert to string
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select first approver" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {members && members.map((member: any) => (
                              <SelectItem key={member.id} value={String(member.id)}>
                                {member.id} - {member.first_name} {member.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {error && <FormMessage>{error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="second_approver"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormLabel>Second Approver</FormLabel>

                        <Select
                          onValueChange={(value: string) => field.onChange(value)}
                          value={field.value ? String(field.value) : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select second approver" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {members && members.map((member: any) => (
                              <SelectItem key={member.id} value={String(member.id)}>
                                {member.id} - {member.first_name} {member.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {error && <FormMessage>{error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>

            <div className="my-5">
              <div className="mx-auto flex justify-center gap-3 w-full max-w-xs bg-transparent">
                {collectionTypes.map((tab) => (
                  <Card
                    key={tab}
                    className={`group flex flex-col items-center justify-center p-3 shadow-none border-primary cursor-pointer transition-all min-w-[140px] flex-1 ${activeTab === tab ? "bg-primary/70 border-none text-white" : ""}`}
                  >
                    <div className="font-semibold">{tab}</div>

                    <div className="mt-0.5 text-lg font-bold group-[.active]:text-white">
                      ${individualTotals[tab] || 0}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <CollectionTransactions ref={transactionRef} savedEntries={savedEntries} setSavedEntries={setSavedEntries} activeTab={activeTab} setActiveTab={setActiveTab}>
            </CollectionTransactions>
          </div>
        </div>
      }
    </>
  );
}