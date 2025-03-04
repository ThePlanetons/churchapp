import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import AxiosInstance from "@/lib/axios";

type Entity = {
  id?: number;
  name: string;
  code: string;
  city: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

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
      className="flex flex-row items-center cursor-pointer"
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      {title}
      {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
    </div>
  );
};

const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column} title="ID" />,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <SortableHeader column={column} title="Entity Code" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} title="Entity Name" />
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => <SortableHeader column={column} title="City" />,
  },
];

function EntityList({
  onAddMember,
}: {
  onAddMember: (memberData: any) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [members, setMembers] = useState<Entity[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Memoize axiosInstance so that it isn't recreated on every render.
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    axiosInstance
      .get("entities/")
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error,
        });
      })
    // .finally(() => setLoading(false));
  }, []);

  const handleItemClick = (member: Entity) => {
    onAddMember(member);
  };

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3 border-b">
        <div className="text-2xl font-semibold">Entity List</div>

        <div className="flex flex-row gap-3">
          <Button onClick={() => onAddMember(null)}>
            <Pencil /> Add Entity
          </Button>
        </div>
      </div>

      <Table>
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
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                onClick={() => handleItemClick(row.original)}
                className="cursor-pointer h-14 hover:bg-gray-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
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
  );
}

export default EntityList;
