import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ConfigureMember({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Configure Member</h2>
      <div className="space-y-2">
        <Input placeholder="Role" />
        <Input placeholder="Permissions" />
      </div>
      <div className="flex space-x-2">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export default ConfigureMember;