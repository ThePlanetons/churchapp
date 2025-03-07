import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Check, Trash, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Textarea } from "@/components/ui/textarea";
import AxiosInstance from "@/lib/axios";

type Entity = {
  code: string;
  name: string;
  primary_phone: string;
  secondary_phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  id?: number;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

const entitySchema = z.object({
  code: z.string().nonempty("Entity Code is required."),
  name: z.string().nonempty("Entity Name is required."),
  primary_phone: z.string().nonempty("Phone Number is required."),
  secondary_phone: z.string().optional(),
  address: z.string().nonempty("Address is required."),
  city: z.string().nonempty("City is required."),
  state: z.string().nonempty("State is required."),
  zip_code: z.string().nonempty("ZIP Code is required."),
  country: z.string().nonempty("Country is required."),
});

function EntityAdd({ onClose, memberData }: { onClose: () => void; memberData?: Entity }) {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<z.infer<typeof entitySchema>>({
    resolver: zodResolver(entitySchema),
    defaultValues: memberData || {
      code: "",
      name: "",
      primary_phone: "",
      secondary_phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "SGP",
    },
  });

  // Memoize axiosInstance so that it isn't recreated on every render.
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  function onSubmit(values: z.infer<typeof entitySchema>) {
    const userName = localStorage.getItem("name") || "Unknown";
    if (memberData) {
      (values as any).updated_by = userName;
    } else {
      (values as any).created_by = userName;
    }

    const request = memberData
      ? axiosInstance.put(
        `entities/${memberData.id}/`,
        values
      )
      : axiosInstance.post("entities/", values);

    request
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: memberData
            ? "Entity updated successfully!"
            : "Entity added successfully!",
        });
        onClose();
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add/update entity. Please try again.",
        });
      });
  }

  function handleDelete() {
    if (!memberData) return;

    axiosInstance
      .delete(`entities/${memberData.id}/`)
      .then(() => {
        toast({
          variant: "default",
          title: "Deleted",
          description: "Entity deleted successfully!",
        });
        setShowDeleteConfirm(false);
        onClose();
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete entity. Please try again.",
        });
        setShowDeleteConfirm(false);
      });
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col justify-between px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">
            {memberData ? "Edit Entity" : "Add Entity"}
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="outline">
              <X className="h-4 w-4" /> Close
            </Button>

            <Button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={form.formState.isSubmitting}
            >
              <Check className="h-4 w-4" />
              {memberData ? "Update" : "Save"}
            </Button>

            {memberData && (
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
              >
                <Trash className="h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Show Created/Updated Info */}
      {memberData && (
        <div className="px-4 py-2 text-xm  text-gray-500 bg-gray-100 border-t border-gray-200 mt-2 text-right italic">
          {memberData.updated_by ? (
            <>
              <span className="font-medium text-gray-600">Last updated:</span>
              <span className="font-bold">{memberData.updated_by} •

                {memberData.updated_at
                  ? new Date(memberData.updated_at).toLocaleString()
                  : "N/A"}
              </span>
            </>
          ) : (
            <>
              <span className="font-medium text-gray-600">Created:</span>
              <span className="font-bold">{memberData.created_by} •
                {memberData.created_at
                  ? new Date(memberData.created_at).toLocaleString()
                  : "N/A"}
              </span>
            </>
          )}
        </div>
      )}

      {/* Form Section */}
      <div className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-5"
          >
            {/* Code Field */}
            <div className="col-span-4 md:col-span-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Entity Code<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Entity Code"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Name Field */}
            <div className="col-span-4 md:col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Entity Name<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Entity Name"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Primary Phone Field */}
            <div className="col-span-4 md:col-span-2">
              <FormField
                control={form.control}
                name="primary_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter Phone Number"
                        {...field}
                        defaultCountry="SG"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Alternative Phone Field */}
            <div className="col-span-4 md:col-span-2">
              <FormField
                control={form.control}
                name="secondary_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter Alternative Phone Number"
                        {...field}
                        value={field.value || ""}
                        defaultCountry="SG"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Field */}
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* City Field */}
            <div className="col-span-2 xl:col-span-1">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* State Field */}
            <div className="col-span-2 xl:col-span-1">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ZIP Code Field */}
            <div className="col-span-2 xl:col-span-1">
              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ZIP Code<span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ZIP Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Country Field */}
            <div className="col-span-2 xl:col-span-1">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country<span className="text-destructive"> *</span>
                    </FormLabel>
                    <CountryDropdown
                      defaultValue={field.value || "SGP"}
                      onChange={(country) => field.onChange(country.alpha3)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>



      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <p className="mt-2">
              This action cannot be undone. This will permanently delete the
              entity and all its associated data.
            </p>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={form.formState.isSubmitting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EntityAdd;
