import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PDFExportProps {
  data: any[];
  fileName?: string;
  excludeColumns?: string[];
  columnMappings?: Record<string, string>;
}

const PDFExportButton: React.FC<PDFExportProps> = ({
  data,
  fileName = "export.pdf",
  excludeColumns = [],
  columnMappings = {},
}) => {
  const exportToPDF = () => {
    if (data.length === 0) {
      console.warn("No data available for export");
      return;
    }

    const doc = new jsPDF();

    // Extract table headers
    const headers = Object.keys(data[0])
      .filter((key) => !excludeColumns.includes(key))
      .map((key) => columnMappings[key] || key);

    // Extract table rows
    const rows = data.map((row) =>
      Object.keys(row)
        .filter((key) => !excludeColumns.includes(key))
        .map((key) => row[key])
    );

    // Generate PDF table
    autoTable(doc,
      {
        head: [headers],
        body: rows as any,
        styles: { fontSize: 12, textColor: [0, 0, 0], minCellHeight: 14, valign: "middle" },
        headStyles: { fontStyle: "bold", fillColor: [0, 150, 136], textColor: 255 },
        bodyStyles: { fillColor: [240, 240, 240] },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      }
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

    doc.save(fileName);

    // const doc = new jsPDF();
    // const tableElement = document.getElementById("table-to-pdf");

    // if (tableElement) {
    //   (doc as any).autoTable({ html: tableElement });
    //   doc.save("table.pdf");
    // }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <FileText /> PDF
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export to PDF</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PDFExportButton;

// const ExportPDFButton = ({ table }: { table: any }) => {
//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     const columns = table.getHeaderGroups().map((headerGroup: any) =>
//       headerGroup.headers.map((header: any) => header.column.columnDef.header)
//     ).flat();

//     const rows = table.getRowModel().rows.map((row: any) =>
//       row.getVisibleCells().map((cell: any) =>
//         flexRender(cell.column.columnDef.cell, cell.getContext())
//       )
//     );

//     // Ensure that the table fits within the page
//     const options = {
//       head: [columns],
//       body: rows,
//       startY: 20,  // Adjust the starting Y position to avoid overlap
//       margin: { top: 10, left: 10, right: 10 },  // Adjust margins
//       pageBreak: "auto",  // This automatically breaks the table if it exceeds the page height
//       theme: "striped",   // Optional: adds striped style to the table
//     };

//     // Check if table height is greater than the page height and split the content
//     const tableHeight = (doc as any).autoTable.previous.finalY; // Get the height of the last table rendered
//     if (tableHeight > doc.internal.pageSize.height - 20) {
//       doc.addPage(); // Add a new page if the table exceeds the current page
//     }

//     // Generate and save the PDF
//     (doc as any).autoTable(options);

//     // (doc as any).autoTable({
//     //   head: [columns],
//     //   body: rows,
//     // });

//     // // autoTable(doc, {
//     // //   head: [columns],
//     // //   body: rows,
//     // // });

//     doc.save("table.pdf");
//   };

//   return (
//     <Button onClick={handleExportPDF}>Export as PDF</Button>
//   );
// };