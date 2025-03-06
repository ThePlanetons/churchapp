import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AxiosInstance from "@/lib/axios";
import CollectionTransactions from "./collection-transaction";
import { z } from "zod";
import { X, Check, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CircleAlertIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { useNavigate, useParams } from "react-router-dom";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  entity: number;
  dynamic_fields: Record<string, any>;
}

// interface Entity {
//   id: number;
//   name: string;
// }

// interface AddCollationProps {
//   onClose: () => void;
//   memberData?: Member | null;
// }

interface Transaction {
  member: number | null;
  collection_type: string;
  collection_amount: string;
  transaction_date: string;
  transaction_type: string;

  id?: number;
}

type CollectionType = "Tithes" | "Mission" | "Partnership" | "Offering";

export function CollectionAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  // const [entities, setEntities] = useState<Entity[]>([]);

  const form = useForm({
    defaultValues: {
      date: "",
      first_approver: "",
      second_approver: "",
    },
  });

  // Memoize your axios instance to include toast for error handling if needed
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  const [collection, setCollection] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetchCollection(id);
    }
  }, [id]);

  const fetchCollection = async (id: string) => {
    try {
      // setLoading(true);
      const { data } = await axiosInstance.get(`/collections/${id}`);
      setCollection(data);
      console.log(collection)
    } catch (error) {
      console.log(error)
      // toast.error("Failed to fetch collection data");
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

  // typeof memberSchema
  function onSubmit(values: z.infer<any>) {
    const combinedPayload = {
      ...values,
      ...savedEntries,
    };

    const request = id
      ? axiosInstance.put(`${API_ENDPOINTS.COLLECTIONS}save_collection/`, combinedPayload)
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
  
  const onClose = () => {
    navigate(`/admin/collections/`);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleClose() {
    const hasEntries = Object.values(savedEntries).some((entries) => entries.length > 0);

    if (hasEntries) {
      setIsDialogOpen(true);
    } else {
      onClose();
    }
  }

  const collectionTypes = ["Tithes", "Mission", "Partnership", "Offering"];
  const [activeTab, setActiveTab] = useState<CollectionType>("Tithes");

  // const [selectedTab, setSelectedTab] = useState(collectionTypes[0]);  // Default to first tab

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
            {id ? `Edit ${activeTab}` : `Add ${activeTab}`}
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="text-lg font-semibold">
              Total Amount: ${displayTotalAmount.toFixed(2)}
            </div> */}

            <Button type="button" onClick={handleClose} variant="outline"><X /> Close</Button>

            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check /> {id ? 'Update' : 'Save'}</Button>

            {id && <Button type="button" variant="destructive"><Trash /> Delete</Button>}
          </div>
        </div>
      </div>

      {/* Tabs */}
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

        <CollectionTransactions savedEntries={savedEntries} setSavedEntries={setSavedEntries}
          activeTab={activeTab} setActiveTab={setActiveTab}>
        </CollectionTransactions>

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
                  name="first_approver"
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
                  name="second_approver"
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

        {/* <div className="my-4 text-lg font-semibold">
          <h2 className="text-xl font-bold">Total Collection Amounts:</h2>

          <ul className="list-disc pl-6">
            {Object.entries(individualTotals).map(([category, total]) => (
              <li key={category}>
                {category}: <span className="font-bold text-primary">${total}</span>
              </li>
            ))}
          </ul>
        </div> */}


        {/* Display grand total */}
        <div className="flex justify-center text-xl font-bold mt-5">
          Grand Total: <span className="text-green-600">${grandTotal}</span>
        </div>

        <div className="my-4">
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

        {/* <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as CollectionType)}>
          <TabsList className="mx-auto flex w-full max-w-xs bg-transparent">
            {collectionTypes.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="group data-[state=active]:bg-primary/70 flex-1 flex-col p-3 text-md data-[state=active]:shadow-none">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs> */}
      </div>
    </div>
  );
}