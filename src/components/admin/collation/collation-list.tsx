import React, { useState, useEffect, useMemo } from "react";
import { ArrowDown, ArrowUp, MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AxiosInstance from "@/lib/axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "../delete-confirmation";
import ExcelExportButton from "../shared/export-to-excel";
import PDFExportButton from "../shared/export-to-pdf";

// Define the Collection interface (adjust types as needed)
interface Collection {
  id: number;
  collection_type: string;
  collection_amount: string;
  transaction_id: string;
  transaction_date: string;
  transaction_type: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  member: number; // This is the member ID
}

// Define the Member interface used for fetching member details
interface Member {
  id: number;
  first_name: string;
  last_name: string;
  dynamic_fields: Record<string, any>;
}

// Reusable sortable header component
const SortableHeader = ({
  column,
  title,
}: {
  column: any;
  title: string;
}) => {
  const isSorted = column.getIsSorted();
  return (
    <div
      className="flex flex-row items-center cursor-pointer h-full"
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      {title}
      {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
    </div>
  );
};

// Component props using the names expected by your usage file
interface CollationListProps {
  onAddMember: (collectionData: Collection | null) => void;
  onConfigureMember?: () => void;
}

function CollationList({ onAddMember, onConfigureMember }: CollationListProps) {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<Member[]>([]);

  // Memoize axiosInstance so that it isn't recreated on every render.
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  // Fetch collections data from the API
  useEffect(() => {
    axiosInstance
      .get("collections/") // Replace with "http://127.0.0.1:8000/api/collections/" if needed
      .then((response) => {
        setCollections(response.data || []);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error loading collections",
          description: "Failed to fetch collections data.",
        });
      })
      .finally(() => setLoading(false));
  }, [axiosInstance, toast]);

  // Fetch members data so we can show member names instead of IDs
  useEffect(() => {
    axiosInstance
      .get("members/")
      .then((response) => {
        setMembers(response.data || []);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error loading members",
          description: "Failed to fetch members data.",
        });
      });
  }, [axiosInstance, toast]);

  // For delete functionality
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const toggleDeleteDialog = (collection: Collection | null = null) => {
    setSelectedCollection(collection);
    setDeleteDialogOpen((prev) => !prev);
  };

  const handleDelete = () => {
    if (selectedCollection) {
      // Uncomment below to actually delete the collection
      // axiosInstance.delete(`collections/${selectedCollection.id}`)
      console.log("Deleting collection", selectedCollection);
    }
    toggleDeleteDialog();
  };

  // Define columns to show only the required fields.
  // For the member column, we override the cell to show the member's full name.
  const columns: ColumnDef<Collection>[] = [
    {
      accessorKey: "member",
      header: ({ column }) => <SortableHeader column={column} title="Member" />,
      cell: ({ getValue }) => {
        const memberId = getValue() as number;
        const member = members.find((m) => m.id === memberId);
        return member ? `${member.first_name} ${member.last_name}` : memberId;
      },
    },
    {
      accessorKey: "collection_amount",
      header: ({ column }) => <SortableHeader column={column} title="Amount" />,
    },
    {
      accessorKey: "transaction_type",
      header: ({ column }) => <SortableHeader column={column} title="Transaction Type" />,
    },
    {
      accessorKey: "collection_type",
      header: ({ column }) => <SortableHeader column={column} title="Collection Type" />,
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => <SortableHeader column={column} title="Created By" />,
    },
  ];

  // When editing a collection, pass its data to the parent using onAddMember.
  const handleEdit = (collection: Collection) => {
    onAddMember(collection);
  };

  const table = useReactTable({
    data: collections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-4 py-3 border-b">
        <div className="text-2xl font-semibold">Collection List</div>
        <div className="flex flex-row items-center gap-3">
          <ExcelExportButton
            data={table.getRowModel().rows.map((row) => row.original)}
            fileName="Collections.xlsx"
            excludeColumns={[
              "actions",
              "transaction_id",
              "transaction_date",
              "created_at",
              "updated_at",
              "updated_by",
            ]}
            columnMappings={{
              member: "Member",
              collection_amount: "Amount",
              transaction_type: "Transaction Type",
              collection_type: "Collection Type",
              created_by: "Created By",
            }}
          />
          <PDFExportButton
            data={table.getRowModel().rows.map((row) => row.original)}
            fileName="Collections.pdf"
            excludeColumns={[
              "actions",
              "transaction_id",
              "transaction_date",
              "created_at",
              "updated_at",
              "updated_by",
            ]}
            columnMappings={{
              member: "Member",
              collection_amount: "Amount",
              transaction_type: "Transaction Type",
              collection_type: "Collection Type",
              created_by: "Created By",
            }}
          />
          <Button onClick={() => onAddMember(null)}>
            <Pencil /> Add Collection
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table id="table-to-pdf">
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-14 text-black tracking-wide"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer h-14 hover:bg-gray-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No collections found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 px-2 h-14 bg-primary rounded-b-xl">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog (if needed) */}
      {/* <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={toggleDeleteDialog}
        onConfirm={handleDelete}
      /> */}
    </div>
  );
}

export default CollationList;
