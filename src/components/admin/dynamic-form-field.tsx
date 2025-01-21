import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface EditDialogProps {
  onSave: (data: {
    checked: boolean;
    description: string;
    label: string;
    name: string;
    placeholder: string;
    required: boolean;
    rowIndex: number;
    type: string;
    variant: string;
  }) => void;
}

const DynamicFormField = ({ onSave }: EditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputData, setInputData] = useState({
    checked: true,
    description: "",
    label: "",
    name: "",
    placeholder: "",
    required: false,
    rowIndex: 0,
    type: "",
    variant: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setInputData((prev) => ({ ...prev, type: value }));
  };

  const handleVariantChange = (variant: string) => {
    setInputData((prev) => ({ ...prev, variant }));
    setIsOpen(true);
  };

  const handleSave = () => {
    const dataObject = {
      checked: inputData.required,
      description: inputData.description,
      label: inputData.label,
      name: inputData.label, // Can be customized as needed
      placeholder: inputData.placeholder,
      required: inputData.required,
      rowIndex: 0,
      type: inputData.type,
      variant: inputData.variant,
    };

    onSave(dataObject);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <Button
          className="rounded-full"
          variant="outline"
          onClick={() => handleVariantChange("Input")}
        >
          Input
        </Button>
        <Button
          className="rounded-full"
          variant="outline"
          onClick={() => handleVariantChange("Checkbox")}
        >
          Checkbox
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {inputData.variant} Field</DialogTitle>
            <DialogDescription>
              Update the {inputData.variant.toLowerCase()} field details below.
            </DialogDescription>
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

              {inputData.variant === "Input" && (
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
              )}

              {inputData.variant === "Input" && (
                <div>
                  <Label htmlFor="type">Input Type</Label>
                  <Select value={inputData.type} onValueChange={handleSelectChange}>
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
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="required"
                checked={inputData.required}
                onCheckedChange={(checked) =>
                  setInputData((prev) => ({ ...prev, required: !!checked }))
                }
              />
              <Label htmlFor="required">Mark as Required Field</Label>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicFormField;
