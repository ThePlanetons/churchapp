import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { z } from "zod";
import { Check, Trash, X } from "lucide-react";
import AxiosInstance from "@/lib/axios";
import Password from "./user-password";
// import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function UserAdd({ onClose, userData }: { onClose: () => void; userData?: any }) {
  const { toast } = useToast();
  const [configData, setConfigData] = useState<any>(null);

  // const [confirmPassword, setconfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  // const checkPassword = (pass: string) => {

  // }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/members/config/")
      .then((response) => {
        setConfigData(response.data);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch config data. Please try again.",
        });
      });
  }, []);

  const memberSchema = z.object({
    first_name: z.string().nonempty("First name is required.").min(1, "First name must be at least 1 characters."),
    last_name: z.string().nonempty("Last name is required.").min(1, "First name must be at least 1 characters."),
    username: z.string().nonempty("User name is required."),
    email_id: z.string().nonempty("Email is required."),
    password: z.string().nonempty("Password is required."),
    confirm_password: z.string().nonempty("Confirm Password is required."),
  });

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: userData || {
      first_name: "",
      last_name: "",
      username: "",
      email_id: "",
      password: "",
      confirm_password: "",
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

    const request = userData
      ? axiosInstance.put(`http://127.0.0.1:8000/api/auth/users/${userData.id}/`, values) // Update request for editing
      : axiosInstance.post("http://127.0.0.1:8000/api/auth/users/", values); // Create request for adding

    request
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: userData ? "User updated successfully!" : "User added successfully!",
        });
        onClose();
      })
      .catch((error) => {
        // Check for response status and handle accordingly
        if (error.response) {
          const { status, data } = error.response;
          // Handle 404 Not Found errors (Page or Member not found)
          if (status === 404) {
            if (data.detail === "No user matches the given query.") {
              toast({
                variant: "destructive",
                title: "User Not Found",
                description: "The User you're trying to edit does not exist.",
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
            <Button type="button" onClick={onClose} variant="outline"><X />Close</Button>

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
              name="email_id"
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

            <Password
              password={form.watch("password")}
              setPassword={(value) => form.setValue("password", value)}
              error={form.formState.errors.password?.message}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter Confirm Password"
                        type={isVisible ? "text" : "password"}

                        {...field} />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                        ) : (
                          <Eye size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                      </button>
                    </div>
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