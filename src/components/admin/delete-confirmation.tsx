// import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

// interface DeleteConfirmationDialogProps {
//   isOpen: boolean; // Correctly type the isOpen prop
//   setIsOpen: (isOpen: boolean) => void; // Correctly type the function to set the state
//   onConfirm: () => void; // The function that will be called on confirmation
//   title?: string; // Optional title
//   description?: string; // Optional description
// }

// function DeleteConfirmationDialog({
//   isOpen,
//   setIsOpen,
//   onConfirm,
//   title = "Are you absolutely sure?",
//   description = "This action cannot be undone. This will permanently delete this item and remove its data from our servers.",
// }: DeleteConfirmationDialogProps) {
//   return (
//     <AlertDialog open={isOpen} onOpenChange={setIsOpen}>  {/* Control the open state */}
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{title}</AlertDialogTitle>
//           <AlertDialogDescription>{description}</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// export default DeleteConfirmationDialog;

// src/components/DeleteDialog.tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, title, description }: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}