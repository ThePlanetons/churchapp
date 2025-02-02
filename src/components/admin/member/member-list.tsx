import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Bolt, MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AxiosInstance from "@/lib/axios";
import {
  ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
  useReactTable
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "../delete-confirmation";
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
import autoTable from 'jspdf-autotable'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  phone: string;
  gender: string;
  dynamic_fields: Record<string, any>;
}

const SortableHeader = ({ column, title }: { column: any; title: string }) => {
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

const ExportPDFButton = ({ table }: { table: any }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = table.getHeaderGroups().map((headerGroup: any) =>
      headerGroup.headers.map((header: any) => header.column.columnDef.header)
    ).flat();

    const rows = table.getRowModel().rows.map((row: any) =>
      row.getVisibleCells().map((cell: any) =>
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )
    );

    // Ensure that the table fits within the page
    const options = {
      head: [columns],
      body: rows,
      startY: 20,  // Adjust the starting Y position to avoid overlap
      margin: { top: 10, left: 10, right: 10 },  // Adjust margins
      pageBreak: "auto",  // This automatically breaks the table if it exceeds the page height
      theme: "striped",   // Optional: adds striped style to the table
    };

    // Check if table height is greater than the page height and split the content
    const tableHeight = (doc as any).autoTable.previous.finalY; // Get the height of the last table rendered
    if (tableHeight > doc.internal.pageSize.height - 20) {
      doc.addPage(); // Add a new page if the table exceeds the current page
    }

    // Generate and save the PDF
    (doc as any).autoTable(options);

    // (doc as any).autoTable({
    //   head: [columns],
    //   body: rows,
    // });

    // // autoTable(doc, {
    // //   head: [columns],
    // //   body: rows,
    // // });

    doc.save("table.pdf");
  };

  return (
    <Button onClick={handleExportPDF}>Export as PDF</Button>
  );
};


function MemberList({ onAddMember, onConfigureMember }: { onAddMember: (memberData: any) => void; onConfigureMember: () => void }) {
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: false }])

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoize the axiosInstance to prevent re-creation on every render
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  useEffect(() => {
    axiosInstance
      .get("members/")
      .then((response) => {
        setMembers(response.data || []);
      })
      .catch((error) => {
        // console.error("API Error:", error);
      })
      .finally(() => setLoading(false));
  }, [axiosInstance]);

  // useEffect(() => {
  //   axios
  //     .get(`${import.meta.env.VITE_API_URL}members/`)
  //     .then((response) => {
  //       setMembers(response.data || []);
  //     })
  //     .catch((error) => {
  //       let errorMessage = "Something went wrong. Please try again.";

  //       if (error.response) {
  //         // Server responded with a status code (like 404, 500)
  //         errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
  //       } else if (error.request) {
  //         // No response received from server (network issue)
  //         errorMessage = "Server is not responding. Check your network or API status.";
  //       } else {
  //         // Other unexpected errors
  //         errorMessage = error.message || "Unknown error occurred.";
  //       }

  //       toast({
  //         variant: "destructive",
  //         title: "Uh oh! Something went wrong.",
  //         description: errorMessage,
  //       });
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const toggleDeleteDialog = (member: any = null) => {
    setSelectedMember(member);
    setDeleteDialogOpen((prev) => !prev);  // Toggle dialog visibility
  };

  const handleDelete = () => {
    if (selectedMember) {
      // axiosInstance.delete(`members/${selectedMember.id}`)
      console.log("Deleting member", selectedMember);
    }
    toggleDeleteDialog();
  };

  const columns: ColumnDef<Member>[] = [
    {
      // accessorKey: "actions",
      // header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(member.id))}
              >
                Copy member ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleItemClick(row.original)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleDeleteDialog(row.original)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => toggleDeleteDialog()}
              onConfirm={handleDelete}
              title="Are you absolutely sure?"
              description="This action cannot be undone. Are you sure you want to permanently delete this member from our servers?"
            />
          </DropdownMenu>
        )
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

  const handleItemClick = (member: Member) => {
    // Send selected member data to AddMember
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

  // Function to export the table to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Extract table rows (excluding the first column)
    const rows = table.getRowModel().rows.map(row =>
      row.getVisibleCells().slice(1).map(cell => cell.getValue())  // Removes first column data
    );

    const headers = [['ID', 'First Name', 'Last Name', 'Email', 'DOB', 'Phone', 'Gender']];

    autoTable(
      doc,
      {
        head: headers,
        body: rows as any,
        styles: { fontSize: 12, textColor: [0, 0, 0], minCellHeight: 14, valign: 'middle' },
        headStyles: { fontStyle: "bold", fillColor: [0, 150, 136], textColor: 255 },
        bodyStyles: { fillColor: [240, 240, 240] },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      },
      // {
      //   html: '#table-to-pdf',
      //   useCss: true,
      //   showHead: "everyPage",
      //   pageBreak: "auto"
      //   // body: [
      //   //   [{ content: 'Text', colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],
      //   // ],
      // },
    );

    doc.save('table.pdf');

    // const doc = new jsPDF();
    // const tableElement = document.getElementById("table-to-pdf");

    // if (tableElement) {
    //   (doc as any).autoTable({ html: tableElement });
    //   doc.save("table.pdf");
    // }
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3 border-b">
        <div className="text-2xl font-semibold">Member List</div>

        <div className="flex flex-row gap-3">
          <Button onClick={exportToPDF} className="mb-4">
            Export to PDF
          </Button>

          <Button onClick={onConfigureMember}><Bolt className="w-8 h-8" /> Configure</Button>

          <Button onClick={() => onAddMember(null)}><Pencil /> Add Member</Button>
        </div>
      </div>

      <Table id="table-to-pdf">
        <TableHeader
          className="bg-lime-400"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
              // onClick={() => onAddMember(row.original)}
              <TableRow
                key={row.id}
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

      <div className="flex items-center justify-end space-x-2 px-2 h-14 bg-lime-400 rounded-b-xl">
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

export default MemberList;