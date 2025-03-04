import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import DynamicFormField from "./dynamic-form-field";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import AxiosInstance from "@/lib/axios";

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

function ConfigureMember({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();

  const [dynamicFields, setDynamicFields] = useState<FormData[]>([]);
  const [dynamicPayload, setDynamicPayload] = useState<any[]>([]);

  const receiveDataFromChild = (data: FormData) => {
    setDynamicFields((prevFields) => [...prevFields, data]);
    setDynamicPayload((prevFields) => [...prevFields, { dynamic_input: data }]);
  };

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

  const defaultValues = dynamicFields.reduce<Record<string, any>>((values, field) => {
    values[field.name] = field.variant === "Checkbox" ? false : "";
    return values;
  }, {});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create the Axios instance with toast
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  const handleConfigSubmit = async () => {
    const payload = {
      data: dynamicPayload,
    };

    axiosInstance.post('member/config/list/', payload)
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Member configured successfully!",
        });
        onClose();
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div className="text-2xl font-bold">Configure Member</div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button type="button" onClick={() => form.handleSubmit(handleConfigSubmit)()}>Save</Button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <DynamicFormField onSave={receiveDataFromChild} />

        {dynamicFields.length > 0 && (
          <Form {...form}>
            <form className="space-y-8 max-w-3xl mx-auto py-10">
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
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ConfigureMember;