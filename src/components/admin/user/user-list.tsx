import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AxiosInstance from "@/lib/axios";
import { User } from "./user";
import { API_ENDPOINTS } from "@/config/api-endpoints";

const SortableHeader = ({ column, title }: { column: any; title: string }) => {
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

const handleMoreOptions = (e: React.MouseEvent, member: any) => {
  e.stopPropagation(); // Prevents triggering other row actions
  // Open your modal or dropdown here, like "View", "Edit", "Delete"
  console.log("More options clicked for", member);
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "actions",
    header: "Actions", // Optional header for the actions column
    cell: ({ row }) => {
      const member = row.original; // Get the row data for actions

      return (
        <div className="flex justify-center">
          <button
            onClick={(e) => handleMoreOptions(e, member)} // Trigger your custom handler
            className="p-2"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column} title="ID" />,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => <SortableHeader column={column} title="First Name" />,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => <SortableHeader column={column} title="Last Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => <SortableHeader column={column} title="DOB" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <SortableHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <SortableHeader column={column} title="Gender" />,
  },
];

function UserList({ onAddUser }: { onAddUser: (memberData: any) => void }) {
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: false }])

  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoize the axiosInstance to prevent re-creation on every render
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.USERS)
      .then((response) => {
        setMembers(response.data || []);
      })
      .catch((error) => {
        // console.error("API Error:", error);
      })
      .finally(() => setLoading(false));
  }, [axiosInstance]);

  const handleItemClick = (member: User) => {
    // Send selected member data to AddMember
    onAddUser(member);
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
        <div className="text-2xl font-bold">User List</div>

        <div className="flex flex-row gap-3">
          <Button onClick={() => onAddUser(null)}>
            <Pencil /> Add User
          </Button>
        </div>
      </div>

      <div className="">
        <Table>
          <TableHeader
            className="bg-primary"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}
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
                  className="cursor-pointer h-14 hover:bg-gray-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}
                      className="font-medium"
                    >
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
      </div>

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
    </div >
  );
}

export default UserList;