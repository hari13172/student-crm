import * as XLSX from "xlsx";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react"; // Import an export icon
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocation, useNavigate } from "react-router";

import AdvancedFilter from "./advanceFilter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyButton } from "@/components/custom-ui/copy-button";
import { DataTablePagination } from "./pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadFile } from "@/components/utils/downloadFile";

interface DataTableProps<TData, TValue> {
  loading: boolean;
  error: any;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  totalPages: number;
  totalRows: number;
  showFilters?: boolean;
  filterColumns?: any;
  filters?: any;
  setFilters?: (filters: any) => void;
  showDownload?: boolean;
  downloadData?: () => void;
  isDownloading?: boolean;
  CustomHeaderComponent?: React.ComponentType<{
    table: any;
    selectedRows: Set<string>;
  }>;
}

export function DataTable<TData, TValue>({
  loading,
  error,
  columns,
  data,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  sorting,
  setSorting,
  totalPages,
  totalRows,
  filterColumns,
  filters,
  setFilters,
  showDownload=false,
  showFilters,
  downloadData,
  isDownloading,
  CustomHeaderComponent,
}: DataTableProps<TData, TValue>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updaterOrValue) => {
      const sortString =
        typeof updaterOrValue === "function"
          ? updaterOrValue(table.getState().sorting)
          : updaterOrValue;
      setSorting(sortString);
      setPageIndex(0);
      const urlParams = new URLSearchParams(window.location.search);
      // Set or update pagination parameters
      urlParams.set("page", "0");
      urlParams.set("size", pageSize.toString());
      urlParams.set("sort", JSON.stringify(sortString));

      // Navigate with updated query parameters
      navigate(`?${urlParams.toString()}`);
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
  });

  // Handle row selection across pages
  const toggleRowSelection = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle select all rows across pages
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row: any) => row.id)));
    }
  };

  // Ensure rows are marked as selected
  const isSelected = (rowId: string) => selectedRows.has(rowId);

  // Download selected rows globally across all pages
  const DownloadData = () => {
    const rowsToDownload = data.filter((row: any) => selectedRows.has(row.id)); // Filter selected rows from full dataset

    // Include all columns, not just visible ones
    const allColumns = table
      .getAllColumns()
      .map((col: any) => col.getIsVisible() && col.id !== "actions" && col.id)
      .filter(Boolean);
    const dataToDownload = rowsToDownload.map((row: any) => {
      const rowData: any = {};
      allColumns.forEach((col: any) => {
        rowData[col] = row[col];
      });
      return rowData;
    });

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Download");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    downloadFile(blob, pathSegments[0]);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center py-2 gap-2 justify-between">
        <div className="flex items-center gap-2">
          {showFilters && (
            <AdvancedFilter
              filterColumns={filterColumns}
              applyFilters={filters}
              onApply={setFilters || (() => {})}
              setPageIndex={setPageIndex}
            />
          )}
          <h1 className="text-base font-medium">Result : {totalRows}</h1>
          {showDownload &&
            (selectedRows.size > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setShowDialog(true)}
              >
                <Download />
                {selectedRows.size}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setShowDialog(true)}
                disabled={isDownloading} // Disable button while downloading
              >
                {isDownloading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download />
                )}
              </Button>
            ))}

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Download</DialogTitle>
                <DialogDescription>
                  {selectedRows.size > 0
                    ? `Are you sure you want to download the selected ${selectedRows.size} rows?`
                    : `Are you sure you want to download all ${totalRows} rows?`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowDialog(false);
                    if (selectedRows.size > 0) {
                      DownloadData();
                    } else {
                      if (downloadData) {
                        downloadData();
                      }
                    }
                  }}
                >
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          {CustomHeaderComponent && (
            <CustomHeaderComponent table={table} selectedRows={selectedRows} />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border h-[75vh] overflow-auto">
        {loading || error || table.getRowModel().rows?.length == 0 ? (
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`bg-data-table ${
                        header.id === "select"
                          ? "sticky left-0 z-50 w-10 text-center"
                          : ""
                      } ${
                        header.id === "actions"
                          ? "sticky right-0 z-20 bg-data-table"
                          : ""
                      }`}
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
              {loading ? (
                table.getHeaderGroups().map((headerGroup) => (
                  <React.Fragment key={headerGroup.id}>
                    {Array.from({ length: 24 }).map((_, index) => (
                      <TableRow key={index}>
                        {headerGroup.headers.map((header) => (
                          <TableCell key={header.id}>
                            <Skeleton className="rounded-full w-full h-2" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : error ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="text-base text-center h-[60vh]"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows?.length == 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="text-base text-center h-[60vh]"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        ) : (
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead
                    id="select"
                    className={`bg-data-table sticky left-0 w-[50px] text-center`}
                  >
                    <Checkbox
                      checked={
                        selectedRows.size == data.length ||
                        (selectedRows.size > 0 && "indeterminate")
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`bg-data-table ${
                        header.id === "actions" && "sticky right-0 z-20"
                      }`}
                      style={{
                        width: header.id === "actions" ? "50px" : "150px",
                      }}
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
              {table.getRowModel().rows.map((row: any) => (
                <TableRow key={row.original.id}>
                  <TableCell
                    id="select"
                    className={`sticky left-0 z-0 w-[50px] hover:bg-muted/30 text-center ${
                      isSelected(row.original.id) ? "bg-muted" : "bg-background"
                    } `}
                    onClick={() => {
                      toggleRowSelection(row.original.id);
                    }}
                  >
                    <Checkbox
                      checked={isSelected(row.original.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell
                      key={cell.id}
                      className={`py-2 w-[150px] truncate
                                                ${
                                                  cell.column.id === "actions"
                                                    ? "sticky right-0 z-0 bg-background hover:bg-muted"
                                                    : ""
                                                }
                                                ${
                                                  isSelected(row.original.id) &&
                                                  "bg-muted"
                                                } 
                                                `}
                    >
                      {cell.column.id === "select" ||
                      cell.column.id === "actions" ? (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="truncate">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="p-2 max-w-[400px] bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700">
                            <div className="text-sm font-bold flex justify-between items-center mb-2">
                              <span>
                                {flexRender(
                                  cell.column.columnDef.title,
                                  cell.getContext()
                                )}
                              </span>
                              <CopyButton text={cell.getValue() as string} />
                            </div>
                            <div className="text-sm bg-zinc-100 dark:bg-zinc-900 p-2 rounded-sm">
                              {cell.getValue()}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <DataTablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
