import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, House, PanelsTopLeft } from "lucide-react";

interface Transaction {
  // id: number;
  // member: string;
  collection_type: string;
  collection_amount: string;
  transaction_date: string;
  transaction_type: string;

  id?: number;
}

export default function CollectionTransactions() {
  const form = useForm<{ transactions: Transaction[] }>({
    defaultValues: {
      transactions: [
        {
          collection_type: "",
          collection_amount: "",
          transaction_date: "",
          transaction_type: ""
        },
      ],
    },
  });

  // const { control, handleSubmit } = form;
  const { control, handleSubmit, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactions",
  });

  // const transactionType = watch("transaction_type");

  const onSubmit = (data: { transactions: Transaction[] }) => {
    console.log("Submitted Data:", data);
  };

  // const [transactions, setTransactions] = useState<Transaction[]>([
  //   { collection_type: "", collection_amount: "", transaction_date: "", transaction_type: "" },
  // ]);

  // const addRow = () => {
  //   setTransactions([
  //     ...transactions,
  //     { collection_type: "", collection_amount: "", transaction_date: "", transaction_type: "" },
  //   ]);
  // };

  // const deleteRow = (index: number) => {
  //   setTransactions(transactions.filter((_, i) => i !== index));
  // };

  // const handleChange = (index: number, field: keyof Transaction, value: string) => {
  //   setTransactions(
  //     transactions.map((t, i) => (i === index ? { ...t, [field]: value } : t))
  //   );
  // };

  // const handleSave = () => {
  //   console.log("Saved Transactions:", transactions);
  //   // Here, you can send the data to an API
  // };

  return (
    <Card className="p-4 space-y-4 shadow-md">
      {/* <Tabs defaultValue={transactionType} onValueChange={(value) => setValue("transactionType", value)}>
        <TabsList className="mb-3">
          <TabsTrigger value="Tithes">
            <House
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Tithes
          </TabsTrigger>

          <TabsTrigger value="Mission" className="group">
            <PanelsTopLeft
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Mission
          </TabsTrigger>

          <TabsTrigger value="Partnership" className="group">
            <Box
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Partnership
          </TabsTrigger>

          <TabsTrigger value="Offering" className="group">
            <Box
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Offering
          </TabsTrigger>
        </TabsList>
      </Tabs> */}

      <Form {...form}>
        <form className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <FormField
                control={control}
                name={`transactions.${index}.collection_type`}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Collection Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Collection Type" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`transactions.${index}.collection_amount`}
                render={({ field }) => (
                  <FormItem className="w-1/5">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Amount" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`transactions.${index}.transaction_date`}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Transaction Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`transactions.${index}.transaction_type`}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction Type" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="button" variant="destructive" onClick={() => remove(index)}><Trash /> Delete</Button>

              <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}><Check /> Save</Button>
            </div>
          ))}

          <div className="flex justify-end">
            <Button type="button"
              onClick={() => append({ collection_type: "", collection_amount: "", transaction_date: "", transaction_type: "" })} >
              Add Transaction
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}