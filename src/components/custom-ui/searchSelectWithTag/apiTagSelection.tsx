import * as React from "react";

import { Check, Loader2, Search, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AuthorizedHeader } from "@/components/api/header";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Option {
  id: string;
  name: string;
}

interface ApiTagSelectionProps {
  control: any;
  name: string;
  label: string;
  apiUrl: string;
  filter?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const ApiTagSelection: React.FC<ApiTagSelectionProps> = ({
  control,
  name,
  label,
  apiUrl,
  filter = "",
  placeholder = "Select options",
  required = false,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [optionsData, setOptionsData] = React.useState<Option[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const CustomHeader = React.useMemo(() => AuthorizedHeader(), []);

  const fetchOptions = React.useCallback(
    async (pageToFetch: number, search: string) => {
      if (disabled) return;
      setIsLoading(true);
      try {
        let url = `${
          import.meta.env.VITE_APP_API_URL
        }${apiUrl}?page=${pageToFetch}&size=50`;
        if (filter) url += `&filters=${filter}`;
        if (search.trim()) {
          const filters = encodeURIComponent(
            JSON.stringify({ name: { $contains: search } })
          );
          url += `&filters=${filters}`;
        }
        const res = await fetch(url, { headers: { ...CustomHeader } });
        if (!res.ok) throw new Error("Error fetching data");
        const data = await res.json();
        setOptionsData((prev) =>
          pageToFetch === 1 ? data.items : [...prev, ...data.items]
        );
        setPage(data.page);
        setTotalPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, filter, CustomHeader, disabled]
  );

  // initial & search effect
  React.useEffect(() => {
    if (disabled) return;
    setOptionsData([]);
    setPage(1);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(
      () => fetchOptions(1, searchQuery),
      300
    );
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchQuery, fetchOptions, disabled]);

  // click outside to close (desktop)
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (!isMobile && open) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [open, isMobile]);

  // infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (disabled || isLoading || page >= totalPages) return;
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      fetchOptions(page + 1, searchQuery);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIds: string[] = field.value || [];
        const selectedOptions = optionsData.filter((o) =>
          selectedIds.includes(o.id)
        );
        const toggle = (id: string) =>
          field.onChange(
            selectedIds.includes(id)
              ? selectedIds.filter((i) => i !== id)
              : [...selectedIds, id]
          );

        return (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>

            {isMobile ? (
              // mobile: drawer
              <>
                <div
                  className="p-2 border rounded cursor-pointer"
                  onClick={() => !disabled && setOpen(true)}
                >
                  {selectedOptions.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedOptions.map((o) => (
                        <span
                          key={o.id}
                          className="inline-flex items-center pl-3 pr-2 py-[2px] bg-secondary/50 text-secondary-foreground border border-info/80 rounded-full text-[12px]"
                        >
                          {o.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggle(o.id);
                            }}
                            className="ml-2"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">{placeholder}</span>
                  )}
                </div>
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerContent>
                    <DrawerHeader className="py-0 pt-2">
                      <DrawerTitle>{label}</DrawerTitle>
                      <DrawerClose onClick={() => setOpen(false)} />
                    </DrawerHeader>
                    <div className="p-2 flex items-center space-x-2 relative">
                      <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-4 w-4 text-muted-foreground/50" />
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
                      ref={listRef}
                      onScroll={handleScroll}
                      className="max-h-60 overflow-y-auto p-2"
                    >
                      {optionsData.map((o) => (
                        <div
                          key={o.id}
                          onClick={() => toggle(o.id)}
                          className={`p-1 px-2 my-1 flex gap-2 items-center rounded ${
                            selectedIds.includes(o.id)
                              ? "bg-primary/10"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {selectedIds.includes(o.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                          <span>{o.name}</span>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="p-2 flex justify-center items-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5 text-gray-500" />{" "}
                          loading...
                        </div>
                      )}
                    </div>
                  </DrawerContent>
                </Drawer>
              </>
            ) : (
              // desktop: inline popup
              <div ref={containerRef} className="relative w-full">
                <div
                  className={`p-2 border rounded-md cursor-pointer ${
                    open ? "ring-2 ring-primary/50" : ""
                  }`}
                  onClick={() => !disabled && setOpen((v) => !v)}
                >
                  {selectedOptions.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedOptions.map((o) => (
                        <span
                          key={o.id}
                          className="inline-flex items-center pl-3 pr-2 py-[2px] bg-secondary/50 text-secondary-foreground border border-info/80 rounded-full text-[12px]"
                        >
                          {o.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggle(o.id);
                            }}
                            className="ml-2"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">{placeholder}</span>
                  )}
                </div>
                {open && (
                  <div className="absolute z-10 w-full mt-1 bg-card border rounded shadow-lg">
                    <div className="p-2 flex items-center space-x-2 relative">
                      <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-4 w-4 text-muted-foreground/50" />
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
                      ref={listRef}
                      onScroll={handleScroll}
                      className="max-h-60 overflow-y-auto p-2"
                    >
                      {optionsData.map((o) => (
                        <div
                          key={o.id}
                          onClick={() => toggle(o.id)}
                          className={`p-1 px-2 my-1 flex gap-2 items-center cursor-pointer rounded ${
                            selectedIds.includes(o.id)
                              ? "bg-primary/10"
                              : "hover:bg-muted"
                          }`}
                        >
                          {selectedIds.includes(o.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                          <span>{o.name}</span>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="p-2 flex justify-center items-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5 text-gray-500" />{" "}
                          loading...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <FormMessage>
              {fieldState.error && fieldState.error.message}
            </FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
