import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AxiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { CalendarIcon, CircleAlertIcon, X, Check, Trash } from "lucide-react";
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

type CollectionType = "Tithes" | "Mission" | "Partnership" | "Offering";

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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // defaultValues: memberData || {
      date: "",
      first_approver: 0,
      second_approver: 0,
    },
  });

  // Memoize your axios instance to include toast for error handling if needed
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    if (id) {
      fetchCollection(id);
    }
  }, [id]);

  const fetchCollection = async (id: string) => {
    try {
      // setLoading(true);
      const { data } = await axiosInstance.get(`/collections/${id}`);

      form.setValue("date", data.date);
      form.setValue("first_approver", data.first_approver.toString()); // Ensure string type
      form.setValue("second_approver", data.second_approver.toString()); // Ensure string type

      setSavedEntries((prevEntries) => ({
        Tithes: Array.isArray(data.transactions.Tithes) ? data.transactions.Tithes : prevEntries.Tithes,
        Mission: Array.isArray(data.transactions.Mission) ? data.transactions.Mission : prevEntries.Mission,
        Partnership: Array.isArray(data.transactions.Partnership) ? data.transactions.Partnership : prevEntries.Partnership,
        Offering: Array.isArray(data.transactions.Offering) ? data.transactions.Offering : prevEntries.Offering,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const getUsername = (member: Member) => {
    const usernameKey = Object.keys(member.dynamic_fields).find((key) =>
      key.startsWith("username_")
    );
    return usernameKey ? member.dynamic_fields[usernameKey] : "N/A";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse] = await Promise.all([
          axiosInstance.get("members/"),
          axiosInstance.get("entities/"),
        ]);

        setMembers(membersResponse.data || []);
        // setEntities(entitiesResponse.data || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to fetch required information",
        });
      } finally {
      }
    };

    fetchData();
  }, [axiosInstance, toast]);

  function onSubmit(values: z.infer<any>) {
    const combinedPayload = {
      ...values,
      ...savedEntries,
    };

    const request = id
      ? axiosInstance.put(`${API_ENDPOINTS.COLLECTIONS}save_collection/${id}/`, combinedPayload)
      : axiosInstance.post(`${API_ENDPOINTS.COLLECTIONS}save_collection/`, combinedPayload);

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

  function handleClose() {
    if (transactionRef.current?.checkUnsavedChanges()) {
      setIsDialogOpen(true);

    } else {
      transactionRef.current?.resetForm(); // Reset the form before closing

      onClose();
    }
  }

  const collectionTypes = ["Tithes", "Mission", "Partnership", "Offering"];
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

  return (
    <div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => toggleDeleteDialog()}
        onConfirm={handleDelete}
        title="Are you absolutely sure?"
        description="This action cannot be undone. Are you sure you want to permanently delete this member from our servers?"
      />

      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold text-center">
            {id ? `Edit Collection - ${activeTab}` : `Add Collection - ${activeTab}`}
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleClose} variant="outline"><X /> Close</Button>

            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check /> {id ? 'Update' : 'Save'}</Button>

            {id && <Button type="button" variant="destructive" onClick={() => toggleDeleteDialog()}>
              <Trash size={16} strokeWidth={2} aria-hidden="true" />
              {/* <Trash />  */}
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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete your account? All your data will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setIsDialogOpen(false);
                onClose()
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

              <FormField
                control={form.control}
                name="first_approver"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="col-start-1">
                    <FormLabel>First Approver</FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={(value: string) => field.onChange(value)}
                        value={field.value ? String(field.value) : ""}
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
                name="second_approver"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Second Approver</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) => field.onChange(value)}
                        value={field.value ? String(field.value) : ""}
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
  );
}