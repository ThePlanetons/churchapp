import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { z } from "zod";
import { Check, Trash, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Entity = {
  name: string;
  code: string;
  id?: number;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

function EntityAdd({ onClose, memberData }: { onClose: () => void; memberData?: any }) {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const entitySchema = z.object({
    code: z.string().nonempty("Entity Code is required."),
    name: z.string().nonempty("Entity Name is required."),
  });

  const form = useForm({
    resolver: zodResolver(entitySchema),
    defaultValues: memberData || {
      code: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof entitySchema>) {
    const name = localStorage.getItem("name");
    (memberData ? (values as any).updated_by = name : (values as any).created_by = name);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    };

    const request = memberData
      ? axios.put(`http://127.0.0.1:8000/api/entities/${memberData.id}/`, values, config)
      : axios.post("http://127.0.0.1:8000/api/entities/", values, config);

    request
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: memberData ? "Entity updated successfully!" : "Entity added successfully!",
        });
        onClose();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add/update entity. Please try again.",
        });
      });
  }

  function handleDelete() {
    if (!memberData) return;
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    };

    axios.delete(`http://127.0.0.1:8000/api/entities/${memberData.id}/`, config)
      .then(() => {
        toast({
          variant: "default",
          title: "Deleted",
          description: "Entity deleted successfully!",
        });
        setShowDeleteConfirm(false);
        onClose();
      })
      .catch((error) => {
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
      <div className="flex flex-col justify-between px-4 py-3 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">
            {memberData ? "Edit Entity" : "Add Entity"}
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="secondary">
              <X className="mr-2 h-4 w-4" /> Close
            </Button>

            <Button 
              type="button" 
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={form.formState.isSubmitting}
            >
              <Check className="mr-2 h-4 w-4" /> 
              {memberData ? 'Update' : 'Save'}
            </Button>

            {memberData && (
              <Button 
                type="button" 
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Entity Code
                    <span className="text-destructive"> *</span>
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Entity Name
                    <span className="text-destructive"> *</span>
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
          </form>
        </Form>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <p className="mt-2">
              This action cannot be undone. This will permanently delete the entity 
              and all its associated data.
            </p>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
            >
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