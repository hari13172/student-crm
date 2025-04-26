"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RippleEffect from "../motion/ripple-effect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings2 } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden h-9 gap-1.5 lg:flex"
        >
          <Settings2 className="h-4 w-4" />
          <span>View</span>
          <RippleEffect className="bg-foreground/30" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 border-b">
          <div className="flex items-center">
            <SheetTitle className="text-lg">Table View Options</SheetTitle>
          </div>
          <SheetDescription className="text-sm text-muted-foreground">
            Customize which columns are visible in your table.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 min-h-[40%]">
          <div className="space-y-1">
            {table
              .getAllColumns()
              .filter((col) => col.accessorFn && col.getCanHide())
              .map((column) => {
                const isVisible = column.getIsVisible();

                return (
                  <label
                    key={column.id}
                    className="flex items-center space-x-3 rounded-md border border-transparent px-3 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={isVisible}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="capitalize font-medium text-sm">
                      {column.id.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                );
              })}
          </div>
        </ScrollArea>
        <SheetFooter>
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Actions</h3>
            </div>
            <Separator className="mb-4" />
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.getAllColumns().forEach((column) => {
                    if (column.getCanHide()) column.toggleVisibility(true);
                  });
                }}
              >
                Show All Columns
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.getAllColumns().forEach((column) => {
                    if (column.getCanHide() && column.id !== "actions")
                      column.toggleVisibility(false);
                  });
                  // Keep at least one column visible
                  const firstColumn = table
                    .getAllColumns()
                    .find((col) => col.getCanHide());
                  if (firstColumn) firstColumn.toggleVisibility(true);
                }}
              >
                Hide All Columns
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
