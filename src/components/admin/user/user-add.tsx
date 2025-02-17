import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import axios from "axios";
import { z } from "zod";
import { format } from "date-fns"
import { CalendarIcon, Check, Trash, X } from "lucide-react";
import AxiosInstance from "@/lib/axios";
import Password from "./user-password";
// import * as z from "zod";
import { Input } from "@/components/ui/input";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

function UserAdd({ onClose, userData }: { onClose: () => void; userData?: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [configData, setConfigData] = useState<any>(null);
  const [formReady, setFormReady] = useState(false); // Prevents rendering before schema is ready

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/members/config/")
      .then((response) => {
        setConfigData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch config data. Please try again.",
        });
      });
  }, []);

  const dynamicSchema = configData
    ? configData.reduce((schema: any, item: any) => {
      if (item.dynamic_input.required) {
        schema[item.dynamic_input.name] = z
          .string()
          .email("Invalid email address 2")
          .nonempty(`${item.dynamic_input.label} is required.`).default("");
      } else {
        schema[item.dynamic_input.name] = z.string().optional().default("");
      }
      return schema;
    }, {})
    : {};

  const memberSchema = z.object({
    first_name: z.string().nonempty("First name is required.").min(2, "First name must be at least 2 characters."),
    last_name: z.string().optional(),

  });

  const defaultDynamicValues = configData?.reduce((acc: any, item: any) => {
    acc[item.dynamic_input.name] = userData?.dynamic_fields?.[item.dynamic_input.name] || "";
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: userData || {
      first_name: "",
      last_name: "",

    },
    // mode: "onChange", // Enable real-time validation
  });

  // useEffect(() => {
  //   console.log("Errors:", form.formState.errors);
  // }, [form.formState.errors]);

  // Reset form values when `userData` or `configData` is available
  useEffect(() => {
    if (userData && configData) {
      const dynamicValues = configData.reduce((acc: any, item: any) => {
        acc[item.dynamic_input.name] = userData.dynamic_fields?.[item.dynamic_input.name] || "";
        return acc;
      }, {});

      form.reset({
        ...userData, // Populate existing fields
        ...dynamicValues, // Populate dynamic fields
      });
    }
  }, [userData, configData]); // Re-run when these values change

  // Create the Axios instance with toast
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);


  function onSubmit(values: z.infer<typeof memberSchema>) {
    const name = localStorage.getItem("name");
    (userData ? (values as any).updated_by = name : (values as any).created_by = name);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    };

    const request = userData
      ? axiosInstance.put(`members/${userData.id}/`, userData) // Update request for editing
      : axiosInstance.post(`members/`, userData); // Create request for adding

    request
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: userData ? "Member updated successfully!" : "Member added successfully!",
        });
        onClose();
      })
      .catch((error) => {
        // Check for response status and handle accordingly
        if (error.response) {
          const { status, data } = error.response;
          // Handle 404 Not Found errors (Page or Member not found)
          if (status === 404) {
            if (data.detail === "No member matches the given query.") {
              toast({
                variant: "destructive",
                title: "Member Not Found",
                description: "The member you're trying to edit does not exist.",
              });
            } else {
              toast({
                variant: "destructive",
                title: "Page Not Found",
                description: "The requested page could not be found.",
              });
            }
          }

          // Handling 400 Bad Request with email issue
          else if (status === 400 && data.email && data.email[0]) {
            toast({
              variant: "destructive",
              title: "Error",
              description: data.email[0], // Show the specific email error
            });
          }
        }
      });
  }

  return (
    <div>
      <div className="flex flex-col justify-between px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">{userData ? "Edit User" : "Add User"}</div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="secondary"><X />Close</Button>

            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check />{userData ? 'Update' : 'Save'}</Button>

            {userData && (<Button type="button" variant="destructive"><Trash /> Delete</Button>
            )}
          </div>
        </div>

        {/* <p>Created by: {userData.created_by || "N/A"}</p>
        <p>Created at: {userData.created_at ? format(new Date(userData.created_at), "PPP p") : "N/A"}</p> */}
        {/* {userData && (
          <div className="flex gap-1 text-sm text-muted-foreground">
            <div>Updated by: {userData.updated_by}, </div>
            <div>Updated at: {format(new Date(userData.updated_at), "PPP p")}</div>
          </div>
        )} */}
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter User Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Id</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email Id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <Password></Password>

              <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
      </div>
    </div>
  );
}

export default UserAdd;