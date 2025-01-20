"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

  // Example of receiving data from a child component or any other source
  const receiveDataFromChild = (data: FormData) => {
    setDynamicFields((prevFields) => [...prevFields, data]);  // Append new data to existing fields
  };

  // const formSchema = z.object({
  //   username: z.string().min(2, {
  //     message: "Username must be at least 2 characters.",
  //   }),
  // })

  // Dynamically generate schema based on dynamicFields
  const formSchema = z.object(
    dynamicFields.reduce<Record<string, z.ZodType>>((schema, field) => {
      if (field.required) {
        schema[field.name] = z.string().nonempty(`${field.label} is required.`);  // Custom error message
      } else {
        schema[field.name] = z.string().optional();
      }
      return schema;
    }, {})
  );

  // Default values based on dynamicFields
  const defaultValues = dynamicFields.reduce<Record<string, string>>((values, field) => {
    values[field.name] = "";
    return values;
  }, {});

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form data submitted:", values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

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
                render={({ field: rhfField, fieldState }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={field.placeholder}
                        type={field.type || "text"}
                        // disabled={field.checked}
                        {...rhfField}
                      />
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
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

      {/* Simulate receiving data */}
      <Button onClick={() => receiveDataFromChild({
        checked: false,
        description: "Your email address",
        label: "Email",
        name: "email",
        placeholder: "Enter your email",
        required: true,
        rowIndex: 0,
        type: "email",
        variant: "Input",
      })}>
        Add Field
      </Button>
    </div>
  );
};

export default UsersPage;
