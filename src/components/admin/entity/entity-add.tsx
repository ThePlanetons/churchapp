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

  const entitySchema = z.object({
    code: z.string().nonempty("Code is required."),
    name: z.string().nonempty("Name is required."),
    created_by: z.string().nonempty("Created by is required."),
  });

  const form = useForm({
    resolver: zodResolver(entitySchema),
    defaultValues: memberData || {
      code: "",
      name: "",
      created_by: "",
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

  function onDelete() {
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
        onClose();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete entity. Please try again.",
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
            {memberData && <Button type="button" onClick={onDelete} variant="destructive">Delete</Button>}
            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <form className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium">Code</label>
            <Input placeholder="Enter Code" {...form.register("code")} />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input placeholder="Enter Name" {...form.register("name")} />
          </div>
          <div>
            <label className="block text-sm font-medium">Created By</label>
            <Input placeholder="Enter Creator Name" {...form.register("created_by")} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEntityMember;
