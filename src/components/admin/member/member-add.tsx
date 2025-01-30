import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import axios from "axios";
import { z } from "zod";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

function AddMember({ onClose, memberData }: { onClose: () => void; memberData?: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [configData, setConfigData] = useState<any>(null);
  const [formReady, setFormReady] = useState(false); // Prevents rendering before schema is ready

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/member/config/list/")
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
    email: z.string().email("Invalid email address"),
    date_of_birth: z.string().nonempty("Date of birth is required."),
    phone: z.string().nonempty("Phone number is required.").min(10, "Phone number must be at least 10 digits."),
    gender: z.string().min(1, "Gender is required"),
    ...dynamicSchema,  // Merge dynamic schema
  });

  const defaultDynamicValues = configData?.reduce((acc: any, item: any) => {
    acc[item.dynamic_input.name] = memberData?.dynamic_fields?.[item.dynamic_input.name] || "";
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: memberData || {
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      phone: "",
      gender: "",
      ...defaultDynamicValues,
    },
    // mode: "onChange", // Enable real-time validation
  });

  // useEffect(() => {
  //   console.log("Errors:", form.formState.errors);
  // }, [form.formState.errors]);

  // Reset form values when `memberData` or `configData` is available
  useEffect(() => {
    if (memberData && configData) {
      const dynamicValues = configData.reduce((acc: any, item: any) => {
        acc[item.dynamic_input.name] = memberData.dynamic_fields?.[item.dynamic_input.name] || "";
        return acc;
      }, {});

      form.reset({
        ...memberData, // Populate existing fields
        ...dynamicValues, // Populate dynamic fields
      });
    }
  }, [memberData, configData]); // Re-run when these values change

  function onSubmit(values: z.infer<typeof memberSchema>) {
    const name = localStorage.getItem("name");

    memberData ? values.updated_by = name : values.created_by = name;

    const dynamicFields: Record<string, any> = {};
    if (configData) {
      configData.forEach((item: any) => {
        dynamicFields[item.dynamic_input.name] = values[item.dynamic_input.name] || "";
      });
    }

    const requestData = {
      ...values,
      dynamic_fields: dynamicFields,  // Store dynamic fields in JSON format
    };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    };

    const request = memberData
      ? axios.put(`http://127.0.0.1:8000/api/member/${memberData.id}/`, requestData, config) // Update request for editing
      : axios.post("http://127.0.0.1:8000/api/member/list/", requestData, config); // Create request for adding

    request
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: memberData ? "Member updated successfully!" : "Member added successfully!",
        });
        onClose();
      })
      .catch((error) => {
        // Check for response status and handle accordingly
        if (error.response) {
          const { status, data } = error.response;

          // Handling 401 Unauthorized with specific messages
          if (status === 401) {
            if (data.code === "bad_authorization_header") {
              toast({
                variant: "destructive",
                title: "Error",
                description: "bad_authorization_header",
              });
            } else if (data.code === "token_not_valid") {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Token is invalid or expired",
              });
            }
          }

          // Handle 404 Not Found errors (Page or Member not found)
          else if (status === 404) {
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
        } else {
          // General catch if error.response is not available
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add/update member. Please try again. " + error.message,
          });
        }
      });
  }

  return (
    <div>
      <div className="flex flex-col justify-between p-4 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">{memberData ? "Edit Member" : "Add Member"}</div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="outline">Close</Button>
            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
          </div>
        </div>

        {/* <p>Created by: {memberData.created_by || "N/A"}</p>
        <p>Created at: {memberData.created_at ? format(new Date(memberData.created_at), "PPP p") : "N/A"}</p> */}
        {memberData && (
          <div className="flex gap-1 text-sm text-muted-foreground">
            <div>Updated by: {memberData.updated_by}, </div>
            <div>Updated at: {format(new Date(memberData.updated_at), "PPP p")}</div>
          </div>
        )}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {configData && configData.map((item: any) => {
              const { label, name, placeholder, required, type } = item.dynamic_input;
              const dynamicValue = form.watch(name) || "";

              return (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input placeholder={placeholder} {...field} required={required} type={type} value={dynamicValue} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              );
            })}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddMember;