import * as React from "react";

import { ChevronDown, Loader2, Search } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { useCallback, useEffect, useRef, useState } from "react";

import { AuthorizedHeader } from "@/components/api/header";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Option {
  id: string;
  value: string;
}

interface ApiResponse {
  items: Option[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface ApiSearchableSelectProps {
  control: any; // Adjust to match your react-hook-form control type.
  name: string;
  label: string;
  apiUrl: string; // The API endpoint (without query params).
  filter?: string; // Optional filter for the API.
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const ApiSearchableSelect: React.FC<ApiSearchableSelectProps> = ({
  control,
  name,
  label,
  apiUrl,
  filter = "",
  placeholder = "Select an option",
  required = false,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [optionsData, setOptionsData] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const CustomHeader = React.useMemo(() => AuthorizedHeader(), []);

  const fetchOptions = useCallback(
    async (pageToFetch: number, search: string) => {
      if (disabled) return;
      setIsLoading(true);
      try {
        let url = `${import.meta.env.VITE_APP_API_URL
          }${apiUrl}?page=${pageToFetch}&size=50`;
        if (filter) {
          url += `& filters=${filter}`;
        }
        if (search.trim() !== "") {
          const filters = encodeURIComponent(
            JSON.stringify({ value: { $contains: search } })
          );
          url += ` & filters=${filters}`;
        }
        const res = await fetch(url, {
          headers: {
            ...CustomHeader,
          },
        });
        if (!res.ok) {
          throw new Error("Error fetching data");
        }
        const data: ApiResponse = await res.json();
        if (pageToFetch === 1) {
          setOptionsData(data.items);
        } else {
          setOptionsData((prev) => [...prev, ...data.items]);
        }
        setPage(data.page);
        setTotalPages(data.pages);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, CustomHeader, disabled]
  );

  useEffect(() => {
    if (disabled) return;
    setOptionsData([]);
    setPage(1);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      fetchOptions(1, searchQuery);
    }, 300);
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchQuery, fetchOptions, disabled]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (disabled || isLoading || page >= totalPages) return;
    const container = e.currentTarget;
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10
    ) {
      fetchOptions(page + 1, searchQuery);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          {isMobile ? (
            <>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  disabled={disabled}
                  onFocus={() => setDrawerOpen(true)}
                  value={field.value?.value ?? ""}
                  placeholder={placeholder}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="text-muted-foreground/50 h-4 w-4" />
                </div>
              </div>
              <Drawer
                open={drawerOpen}
                onOpenChange={(isOpen) => {
                  setDrawerOpen(isOpen);
                  if (!isOpen) (document.activeElement as HTMLElement)?.blur();
                }}
              >
                <DrawerContent>
                  <DrawerHeader className="py-0 pt-2">
                    <DrawerTitle>{label}</DrawerTitle>
                    <DrawerClose onClick={() => setDrawerOpen(false)} />
                  </DrawerHeader>
                  <div className="p-2 flex items-center space-x-2 relative">
                    <Search className="text-muted-foreground/50 h-4 w-4 absolute top-1/2 -translate-y-1/2 left-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => {
                        setIsLoading(true);
                        setSearchQuery(e.target.value);
                      }}
                      disabled={disabled}
                    />
                  </div>
                  <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="max-h-60 overflow-y-auto p-2"
                  >
                    {optionsData.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          field.onChange({
                            id: option.id,
                            value: option.value,
                          });
                          setDrawerOpen(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      >
                        {option.value}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="p-2 flex justify-center items-center space-x-2 text-gray-500">
                        <Loader2 className="animate-spin h-5 w-5" />
                      </div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <Select
              onValueChange={(val) => {
                const selected = optionsData.find((o) => o.id === val);
                if (selected)
                  field.onChange({ id: selected.id, value: selected.value });
              }}
              defaultValue={field.value?.id ?? ""}
              disabled={disabled}
            >
              <FormControl className="w-full">
                <SelectTrigger disabled={disabled}>
                  <SelectValue
                    placeholder={placeholder}
                    defaultValue={field.value?.value ?? ""}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <div className="p-2 flex items-center space-x-2 relative">
                  <Search className="text-muted-foreground/50 h-4 w-4 absolute top-1/2 -translate-y-1/2 left-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setIsLoading(true);
                      setSearchQuery(e.target.value);
                    }}
                    disabled={disabled}
                  />
                </div>
                <div
                  ref={containerRef}
                  onScroll={handleScroll}
                  className="max-h-60 overflow-y-auto"
                >
                  {optionsData.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.value}
                    </SelectItem>
                  ))}
                  {isLoading && (
                    <div className="p-2 flex justify-center items-center space-x-2 text-gray-500">
                      <Loader2 className="animate-spin h-5 w-5" />
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};