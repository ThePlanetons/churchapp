import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DynamicFormField = () => {
  const [showForm, setShowForm] = useState(false);
  const [inputData, setInputData] = useState({
    checked: true,
    description: "",
    disabled: false,
    label: "",
    name: "",
    placeholder: "",
    required: false,
    rowIndex: 0,
    type: "",
    value: "",
    variant: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setInputData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setInputData((prev) => ({ ...prev, type: value }));
  };

  const handleSave = () => {
    console.log("Saved Input Data:", JSON.stringify(inputData, null, 2));
    setShowForm(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline">
          Input
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Input Field</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                name="label"
                type="text"
                value={inputData.label}
                onChange={handleInputChange}
                placeholder="Enter label"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={inputData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                name="placeholder"
                type="text"
                value={inputData.placeholder}
                onChange={handleInputChange}
                placeholder="Enter placeholder"
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={inputData.type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-md border p-4 shadow">
            <Checkbox
              id="required"
              name="required"
              checked={inputData.required}
             // onChange={handleInputChange}
            />
            <Label htmlFor="required" className="text-sm font-medium">
              Mark as Required Field
            </Label>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicFormField;
