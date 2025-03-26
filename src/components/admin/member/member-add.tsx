import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { z } from "zod";
import { format } from "date-fns"
import { CalendarIcon, Check, Trash, X } from "lucide-react";
import AxiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Textarea } from "@/components/ui/textarea";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

function AddMember({ onClose, memberData }: { onClose: () => void; memberData?: any }) {
  const { toast } = useToast();
  const [configData, setConfigData] = useState<any>(null);
  const [entitiesData, setEntities] = useState<any>(null);
  // const [loading, setLoading] = useState<boolean>(true);

  // Create the Axios instance with toast
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    axiosInstance
      .get("members/config/")
      .then((response) => {
        setConfigData(response.data);
        // setLoading(false);
      })
      .catch(() => {
        // setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch config data. Please try again.",
        });
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.ENTITIES)
      .then((response) => {
        setEntities(response.data);
        // setLoading(false);
      })
      .catch(() => {
        // setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to entity data. Please try again.",
        });
      });
  }, []);

  const dynamicSchema = configData
    ? configData.reduce((schema: any, item: any) => {
      if (item.dynamic_input.required) {
        schema[item.dynamic_input.name] = z.string().email("Invalid email address 2").nonempty(`${item.dynamic_input.label} is required.`).default("");
      } else {
        schema[item.dynamic_input.name] = z.string().optional().default("");
      }
      return schema;
    }, {})
    : {};

  const memberSchema = z.object({
    entity: z.coerce.number({ invalid_type_error: "Entity is required." }).min(1, "Entity is required."),  // Ensure value is greater than 0
    first_name: z.string().nonempty("First Name is required.").min(2, "First Name must be at least 2 characters."),
    last_name: z.string().nonempty("Last Name is required.").min(2, "Last Name must be at least 2 characters."),
    email: z.string().email("Invalid email address"),
    date_of_birth: z.string().nonempty("Date of birth is required."),
    phone: z.string().nonempty("Phone number is required.").min(10, "Phone number must be at least 10 digits."),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().nonempty("Address is required."),
    city: z.string().nonempty("City is required."),
    state: z.string().nonempty("State is required."),
    zip_code: z.string().nonempty("ZIP Code is required."),
    country: z.string().nonempty("Country is required."),
    tithe_pay: z.boolean().default(false),
    tithe_pay_type: z.string().nullable().optional(),
    ...dynamicSchema,  // Merge dynamic schema
  }).superRefine((data, ctx) => {
    if (data.tithe_pay && !data.tithe_pay_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tithe pay type is required when tithe pay is checked.",
        path: ["tithe_pay_type"]
      });
    }
  });

  const defaultDynamicValues = configData?.reduce((acc: any, item: any) => {
    acc[item.dynamic_input.name] = memberData?.dynamic_fields?.[item.dynamic_input.name] || "";
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: memberData || {
      entity: "",
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      phone: "",
      gender: "",
      address: "",
      city: "Singapore",
      state: "Singapore",
      zip_code: "",
      country: "SGP",
      tithe_pay: false,
      tithe_pay_type: "",
      ...defaultDynamicValues,
    },
    // mode: "onChange", // Enable real-time validation
  });

  const tithePay = form.watch("tithe_pay"); // Watch the checkbox value

  useEffect(() => {
    if (!tithePay) {
      form.setValue("tithe_pay_type", ""); // Reset when unchecked
    }
  }, [tithePay, form]);

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

    const request = memberData
      ? axiosInstance.put(`members/${memberData.id}/`, requestData)  // Update request for editing
      : axiosInstance.post(`members/`, requestData);  // Create request for adding

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

    // request
    //   .then(() => {
    //     toast({
    //       variant: "default",
    //       title: "Success",
    //       description: memberData ? "Member updated successfully!" : "Member added successfully!",
    //     });
    //     onClose();
    //   })
    //   .catch((error) => {
    //     // Check for response status and handle accordingly
    //     if (error.response) {
    //       const { status, data } = error.response;

    //       // Handling 401 Unauthorized with specific messages
    //       if (status === 401) {
    //         if (data.code === "bad_authorization_header") {
    //           toast({
    //             variant: "destructive",
    //             title: "Error",
    //             description: "bad_authorization_header",
    //           });
    //         } else if (data.code === "token_not_valid") {
    //           toast({
    //             variant: "destructive",
    //             title: "Error",
    //             description: "Token is invalid or expired",
    //           });
    //         }
    //       }

    //       // Handle 404 Not Found errors (Page or Member not found)
    //       else if (status === 404) {
    //         if (data.detail === "No member matches the given query.") {
    //           toast({
    //             variant: "destructive",
    //             title: "Member Not Found",
    //             description: "The member you're trying to edit does not exist.",
    //           });
    //         } else {
    //           toast({
    //             variant: "destructive",
    //             title: "Page Not Found",
    //             description: "The requested page could not be found.",
    //           });
    //         }
    //       }

    //       // Handling 400 Bad Request with email issue
    //       else if (status === 400 && data.email && data.email[0]) {
    //         toast({
    //           variant: "destructive",
    //           title: "Error",
    //           description: data.email[0], // Show the specific email error
    //         });
    //       }
    //     } else {
    //       // General catch if error.response is not available
    //       toast({
    //         variant: "destructive",
    //         title: "Error",
    //         description: "Failed to add/update member. Please try again. " + error.message,
    //       });
    //     }
    //   });
  }

  return (
    <div>
      <div className="px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">{memberData ? "Edit Member" : "Add Member"}</div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="outline"><X /> Close</Button>

            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check /> {memberData ? 'Update' : 'Save'}</Button>

            {memberData && <Button type="button" variant="destructive"><Trash /> Delete</Button>}
          </div>
        </div>
      </div>

      {/* <p>Created by: {memberData.created_by || "N/A"}</p>
        <p>Created at: {memberData.created_at ? format(new Date(memberData.created_at), "PPP p") : "N/A"}</p> */}
      {memberData && (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-1 p-2 text-sm text-muted-foreground bg-gray-100 rounded-lg">
            <div className="flex flex-row gap-1">
              Updated by:
              <div className="font-bold">
                {memberData.updated_by},
              </div>
            </div>

            <div className="flex flex-row gap-1">
              Updated at:
              <div className="font-bold">
                {format(new Date(memberData.updated_at), "PPP p")}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <Form {...form}>
          <form className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="entity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity</FormLabel>

                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an entity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {entitiesData && entitiesData.map((entity: any) => (
                            <SelectItem key={entity.id} value={String(entity.id)}>
                              {entity.code} - {entity.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            {/* <FormField
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
            /> */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Phone number</FormLabel>
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

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-2 grid grid-cols-4 gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ZIP Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <CountryDropdown
                      defaultValue={field.value}
                      onChange={(country) => {
                        field.onChange(country.alpha3);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 rounded border p-4">
              <div className="grid grid-cols-2 gap-5 items-center">
                <FormField
                  control={form.control}
                  name="tithe_pay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Tithe Pay
                        </FormLabel>
                        <FormDescription>
                          You can manage your mobile notifications in.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tithe_pay_type"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "space-y-3",
                        !tithePay && "opacity-50 pointer-events-none" // Disable interactions and gray out
                      )}>
                      <FormLabel>Tithe Pay Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!tithePay}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="'Person Pay'" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Person Pay
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="'Group Pay'" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Group Pay
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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