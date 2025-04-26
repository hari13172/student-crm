import { ArrowDownWideNarrow, ArrowUpDown, ArrowUpNarrowWide } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Column } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div
      className={cn("flex items-center justify-between space-x-2 cursor-pointer", className)}
      onClick={() => {
        if (column.getIsSorted() === "asc") {
          column.toggleSorting(true)
        } else if (column.getIsSorted() === "desc") {
          column.clearSorting()
        } else {
          column.toggleSorting(false)
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger className="truncate"><span className="select-none">{title}</span></TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
      <span className="flex-shrink-0">
        {column.getIsSorted() === "asc" ? (
          <ArrowUpNarrowWide className="w-3 h-3" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownWideNarrow className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3" />
        )}
      </span>
    </div>
  )
}