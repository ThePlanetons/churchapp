import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Sheet } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExcelExportProps {
  data: any[];
  fileName?: string;
  excludeColumns?: string[];
  columnMappings?: Record<string, string>;
}

/**
 * Exports data to an Excel file.
 * @param data - Array of objects representing table rows.
 * @param fileName - Name of the exported file (default: "export.xlsx").
 * @param excludeColumns - Columns to exclude from export.
 * @param columnMappings - Object mapping original keys to custom column headers.
 */
const ExcelExportButton: React.FC<ExcelExportProps> = ({
  data,
  fileName = "export.xlsx",
  excludeColumns = [],
  columnMappings = {},
}) => {
  const exportToExcel = () => {
    if (data.length === 0) {
      console.warn("No data available for export");
      return;
    }

    // Remove unwanted columns and map column names
    const filteredData = data.map((row) => {
      const newRow: Record<string, any> = {};
      Object.keys(row).forEach((key) => {
        if (!excludeColumns.includes(key)) {
          newRow[columnMappings[key] || key] = row[key]; // Use mapped name if available
        }
      });
      return newRow;
    });

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create and export workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={exportToExcel}>
            <Sheet /> Excel
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export to Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExcelExportButton;

// const exportToExcel = (
//     data: any[],
//     fileName: string = "export.xlsx",
//     excludeColumns: string[] = [],
//     columnMappings: Record<string, string> = {}
// ) => {
//     if (data.length === 0) {
//         console.warn("No data available for export");
//         return;
//     }

//     // Remove unwanted columns and map column names
//     const filteredData = data.map((row) => {
//         const newRow: Record<string, any> = {};
//         Object.keys(row).forEach((key) => {
//             if (!excludeColumns.includes(key)) {
//                 newRow[columnMappings[key] || key] = row[key]; // Use mapped name if available
//             }
//         });
//         return newRow;
//     });

//     // Convert to worksheet
//     const worksheet = XLSX.utils.json_to_sheet(filteredData);

//     // Create and export workbook
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, fileName);
// };