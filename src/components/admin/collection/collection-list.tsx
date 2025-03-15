import { useState, useEffect, useMemo } from "react";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";

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
import ExcelExportButton from "../shared/export-to-excel";
import PDFExportButton from "../shared/export-to-pdf";
import { useNavigate } from "react-router-dom";

// Define the Collection interface (adjust types as needed)
interface Collection {
  id: number;
  collection_type: string;
  collection_amount: string;
  transaction_id: string;
  transaction_date: string;
  transaction_type: string;
  member: number;

  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;

  transactions?: any | null;
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

function CollectionList() {
  const navigate = useNavigate();

  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize axiosInstance so that it isn't recreated on every render.
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  // Fetch collections data from the API
  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get("collections/")
      .then((response: any) => {
        setCollections(response.data || []);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error loading collections",
          description: "Failed to fetch collections data.",
        });
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  }, [axiosInstance, toast]);

  const handleItemClick = (id: number) => {
    navigate(`/admin/collections/${id}`);
  };

  // // For delete functionality
  // const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // const toggleDeleteDialog = (collection: Collection | null = null) => {
  //   setSelectedCollection(collection);
  //   setDeleteDialogOpen((prev) => !prev);
  // };

  // const handleDelete = () => {
  //   if (selectedCollection) {
  //     // Uncomment below to actually delete the collection
  //     // axiosInstance.delete(`collections/${selectedCollection.id}`)
  //     console.log("Deleting collection", selectedCollection);
  //   }
  //   toggleDeleteDialog();
  // };

  // Define columns to show only the required fields.
  // For the member column, we override the cell to show the member's full name.
  const columns: ColumnDef<Collection>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column} title="Collection ID" />,
    },
    {
      accessorKey: "first_approver_name",
      header: ({ column }) => <SortableHeader column={column} title="First Approver" />,
    },
    {
      accessorKey: "second_approver_name",
      header: ({ column }) => <SortableHeader column={column} title="Second Approver" />,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
    },
    {
      accessorFn: (row) => row.transactions?.grand_total,
      id: "grand_total",
      header: ({ column }) => <SortableHeader column={column} title="Grand Total" />,
      cell: ({ row }) => {
        const amount = row.getValue<number>("grand_total"); // Type casting here
        return (
          <div className="text-right font-bold">
            {amount?.toLocaleString("en-SG", {
              style: "currency",
              currency: "SGD",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => <SortableHeader column={column} title="Created By" />,
    },
  ];

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
  
            <Button onClick={() => navigate("add")}>
              <Pencil /> Add Collection
            </Button>
          </div>
        </div>
  
        <Table id="table-to-pdf">
          <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-14 text-white tracking-wide">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
  
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex justify-center items-center h-40">
                    <div className="loader"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleItemClick(row.original.id)}
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
              )
            )}
          </TableBody>
        </Table>
  
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
      </div>
    </div>
  );
  ;
}

export default CollectionList;