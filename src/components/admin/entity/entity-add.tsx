import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { z } from "zod";

function AddEntityMember({ onClose, memberData }: { onClose: () => void; memberData?: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    setLoading(false); // ✅ No need for config API call
  }, []);

  const entitySchema = z.object({
    entity_name: z.string().nonempty("Entity name is required."),
    entity_code: z.string().nonempty("Entity code is required."),
  });

  const form = useForm({
    resolver: zodResolver(entitySchema),
    defaultValues: memberData || {
      entity_name: "",
      entity_code: "",
    },
  });

  function onSubmit(values: z.infer<typeof entitySchema>) {
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

  return (
    <div>
      <div className="flex flex-col justify-between p-4 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold">Add Entity</div>
          <div className="flex gap-3">
            <Button type="button" onClick={onClose} variant="outline">Close</Button>
            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <form className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium">Entity Name</label>
            <Input placeholder="Enter Entity Name" {...form.register("entity_name")} />
          </div>
          <div>
            <label className="block text-sm font-medium">Entity Code</label>
            <Input placeholder="Enter Entity Code" {...form.register("entity_code")} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEntityMember;
