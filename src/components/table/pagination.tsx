import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

interface DataTablePaginationProps {
  pageIndex: number
  pageSize: number
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  totalPages: number
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  totalPages,
}: DataTablePaginationProps) {
  const navigate = useNavigate()
  function updateQueryParams(ps:number, ss:number) {
    const urlParams = new URLSearchParams(window.location.search);

    // Set or update pagination parameters
    urlParams.set('page', ps.toString());
    urlParams.set('size', ss.toString());

    // Navigate with updated query parameters
    navigate(`?${urlParams.toString()}`);
}
  return (
    <div className="flex items-center justify-between p-2">
      <div className="w-full flex items-center justify-between space-x-4 lg:space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden sm:block">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value: any) => {
              setPageSize(Number(value))
              updateQueryParams(0, Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[25, 50, 75, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              setPageIndex(0)
              updateQueryParams(0, pageSize)
            }}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
            <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              setPageIndex(pageIndex - 1)
              updateQueryParams(pageIndex - 1, pageSize)
            }}
            disabled={pageIndex === 0}
            >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
            </Button>
            <div className="text-sm font-medium">
            {pageIndex + 1} of {totalPages}
            </div>
            <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              setPageIndex(pageIndex + 1)
              updateQueryParams(pageIndex + 1, pageSize)
            }}
            disabled={pageIndex >= totalPages - 1}
            >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
            </Button>
            <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              setPageIndex(totalPages - 1)
              updateQueryParams(totalPages - 1, pageSize)
            }}
            disabled={pageIndex >= totalPages - 1}
            >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}