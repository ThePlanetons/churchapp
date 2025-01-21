"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import DynamicFormField from "./dynamic-form-field.tsx";

interface FormData {
  checked: boolean;
  description: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  rowIndex: number;
  type: string;
  variant: string;
}

const UsersPage = () => {
  const [dynamicFields, setDynamicFields] = useState<FormData[]>([]);
  const [dynamicPayload, setDynamicPayload] = useState<any[]>([]);

  // Receive dynamic form field data from child component
  const receiveDataFromChild = (data: FormData) => {
    setDynamicFields((prevFields) => [...prevFields, data]);
    setDynamicPayload((prevFields) => [...prevFields, { dynamic_input: data }]);
  };

  // Dynamically generate schema based on dynamicFields
  const formSchema = z.object(
    dynamicFields.reduce<Record<string, z.ZodType>>((schema, field) => {
      if (field.required) {
        schema[field.name] =
          field.variant === "Checkbox"
            ? z.boolean().refine((val) => val === true, { message: `${field.label} must be checked.` })
            : z.string().nonempty(`${field.label} is required.`);
      } else {
        schema[field.name] = field.variant === "Checkbox" ? z.boolean().optional() : z.string().optional();
      }
      return schema;
    }, {})
  );

  // Default values based on dynamicFields
  const defaultValues = dynamicFields.reduce<Record<string, any>>((values, field) => {
    values[field.name] = field.variant === "Checkbox" ? false : "";
    return values;
  }, {});

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission with API call
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const apiUrl = "http://127.0.0.1:8000/api/member/config/list/";
    const accessToken = localStorage.getItem("access_token");

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      data: dynamicPayload,
    };

    try {
      const response = await axios.post(apiUrl, payload, config);
      console.log("Response:", response.data);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div>
      <DynamicFormField onSave={receiveDataFromChild} />

      {dynamicFields.length > 0 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
            {dynamicFields.map((field, index) => (
              <FormField
                key={index}
                control={form.control}
                name={field.name || `field_${index}`}
                render={({ field: rhfField }) => (
                  <FormItem className={field.variant === "Checkbox" ? "flex flex-row items-center space-x-3 p-4 border rounded-md" : "space-y-2"}>
                    {field.variant === "Checkbox" ? (
                      <>
                        <FormControl>
                          <Checkbox checked={rhfField.value} onCheckedChange={rhfField.onChange} />
                        </FormControl>
                        <div className="flex flex-col">
                          <FormLabel>{field.label}</FormLabel>
                          <FormDescription>{field.description}</FormDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input placeholder={field.placeholder} type={field.type || "text"} {...rhfField} />
                        </FormControl>
                        {field.description && <FormDescription>{field.description}</FormDescription>}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}

    </div>
  );
};

export default UsersPage;
