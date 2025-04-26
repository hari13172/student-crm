import * as React from "react";

import { ChevronDown, Search } from "lucide-react";
// Import Drawer components (for mobile view)
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// Import your Form and Select components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  control: any; // Adjust to your react-hook-form control type
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Use your custom mobile hook
  const isMobile = useIsMobile();

  // Filter options based on the search query (case insensitive)
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-600">*</span>}
          </FormLabel>
          {isMobile ? (
            // Mobile view: Use a button trigger that opens a Drawer.
            <>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  disabled={disabled}
                  onFocus={() => setDrawerOpen(true)}
                  value={
                    field.value
                      ? options.find((o) => o.id === field.value)?.name
                      : ""
                  }
                  placeholder={placeholder}
                />
                {/* Dropdown icon */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="text-muted-foreground/50 h-4 w-4" />
                </div>
              </div>
              <Drawer
                open={drawerOpen}
                onOpenChange={(isOpen) => {
                  setDrawerOpen(isOpen);
                  if (!isOpen) {
                    // Remove focus when the Drawer closes
                    (document.activeElement as HTMLElement)?.blur();
                  }
                }}
              >
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{label}</DrawerTitle>
                    <DrawerClose onClick={() => setDrawerOpen(false)} />
                  </DrawerHeader>
                  {/* Search input in the Drawer */}
                  <div className="p-2 flex items-center space-x-2 relative">
                    <Search className="text-muted-foreground/50 h-4 w-4 absolute top-1/2 -translate-y-1/2 left-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={disabled}
                    />
                  </div>
                  {/* Scrollable options list */}
                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => {
                            field.onChange(option.id);
                            setDrawerOpen(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                        >
                          {option.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No result found</div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            // Desktop view: Use your standard Select component with a search field.
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger disabled={disabled}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* Search field */}
                <div className="p-2 flex items-center space-x-2 relative">
                  <Search className="text-muted-foreground/50 h-4 w-4 absolute top-1/2 -translate-y-1/2 left-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={disabled}
                  />
                </div>
                {/* Scrollable container for options */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No result found</div>
                  )}
                </div>
              </SelectContent>
            </Select>
          )}
          <FormMessage>
            {fieldState.error ? fieldState.error.message : null}
          </FormMessage>
        </FormItem>
      )}
    />
  );
};
