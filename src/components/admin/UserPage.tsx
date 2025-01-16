import DynamicFormField from "./dynamic-form-field.tsx";
"use client";
//import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Provided JSON
const formFields = [
  {
    checked: true,
    description: "This is your public display name.",
    disabled: false,
    label: "Username",
    name: "name_7560636344",
    placeholder: "shadcn",
    required: true,
    rowIndex: 0,
    type: "",
    value: "",
    variant: "Input",
  },
];

// Dynamically generate schema based on JSON
const formSchema = z.object(
  formFields.reduce<Record<string, z.ZodType>>((schema, field) => {
    if (field.required) {
      schema[field.name] = z.string().nonempty(`${field.label} is required.`);
    } else {
      schema[field.name] = z.string().optional();
    }
    return schema;
  }, {})
);

const defaultValues = formFields.reduce<Record<string, string>>((values, field) => {
  values[field.name] = field.value || "";
  return values;
}, {});

const UsersPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
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
      <DynamicFormField />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          {formFields.map((field, index) => (
            <FormField
              key={index}
              control={form.control}
              name={field.name || `field_${index}`}
              render={({ field: rhfField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder}
                      type={field.type || "text"}
                      disabled={field.disabled}
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
    </div>
  );
};

export default UsersPage;
