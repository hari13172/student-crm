import {
  CircleX,
  FilterIcon,
  FilterX,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/custom-ui/date-picker";
import { Input } from "@/components/ui/input";
import RippleEffect from "../motion/ripple-effect";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface Filter {
  field: string;
  operator: string;
  value: string;
}

interface FilterGroup {
  id: number;
  type: "$and" | "$or";
  filters: Filter[];
  subgroups: FilterGroup[];
}

export interface FilterColumn {
  name: string;
  label: string;
  type: string;
}

interface AdvancedFilterProps {
  filterColumns: FilterColumn[];
  applyFilters: {};
  onApply: (filters: any) => void;
  setPageIndex: (pageIndex: number) => void;
}

const FilterGroupComponent = ({
  group,
  filterColumns,
  addFilter,
  removeFilter,
  updateFilter,
  addSubgroup,
  removeSubgroup,
  updateGroupType,
  removeGroup,
  level = 0,
}: any) => {
  const getOperators = (type: string) => {
    switch (type) {
      case "string":
        return [
          "=",
          "!=",
          "contains",
          "not contains",
          "startsWith",
          "endsWith",
          "isnotempty",
          "isempty",
          "isanyof",
        ];
      case "int":
        return ["=", "!=", "<", "<=", ">", ">=", "in"];
      case "bool":
        return ["=", "!="];
      case "date":
        return ["=", "!=", "<", "<=", ">", ">="];
      default:
        return ["=", "!="];
    }
  };

  const getInputField = (
    type: string,
    value: string,
    onChange: (value: string) => void
  ) => {
    switch (type) {
      case "string":
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      case "int":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      case "bool":
        return (
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          />
        );
      case "date":
        return (
          <DatePicker
            date={value ? new Date(value + "T00:00:00") : undefined}
            onDateChange={(date: any) => {
              if (date) {
                const localDate = new Date(
                  date.getTime() - date.getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .split("T")[0]; // Adjust for local timezone
                onChange(localDate);
              } else {
                onChange("");
              }
            }}
            maxDate={new Date()}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Group Header */}
      <div
        className="flex items-center gap-2 rounded-md py-1 pl-1 bg-background
        sticky top-0 z-10"
      >
        <Select
          value={group.type}
          onValueChange={(value) => updateGroupType(group.id, value)}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="$and">AND</SelectItem>
            <SelectItem value="$or">OR</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="success"
            size={"sm"}
            className="h-8 px-2 cursor-pointer"
            onClick={() => addFilter(group.id)}
          >
            <Plus /> Add
            <RippleEffect className="bg-background/50" />
          </Button>
          {level > 0 && (
            <Button
              variant="destructive"
              size={"sm"}
              className="h-8 px-2 cursor-pointer"
              onClick={() => removeSubgroup(group.id)}
            >
              <Minus className="mr-2" /> Remove
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {group.filters.map((filter: Filter, filterIndex: number) => {
          const column = filterColumns.find(
            (col: any) => col.name === filter.field
          );
          const type = column ? column.type : "string";
          return (
            <div
              key={filterIndex}
              className="flex flex-col sm:flex-row items-center gap-2 rounded-md px-2 pb-1"
            >
              <Select
                value={filter.field}
                onValueChange={(value) =>
                  updateFilter(group.id, filterIndex, "field", value)
                }
              >
                <SelectTrigger className="w-full sm:w-32 h-8">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {filterColumns.map((column: any) => (
                    <SelectItem key={column.name} value={column.name}>
                      {column.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filter.operator}
                onValueChange={(value) =>
                  updateFilter(group.id, filterIndex, "operator", value)
                }
              >
                <SelectTrigger className="w-full sm:w-24 h-8">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {getOperators(type).map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getInputField(type, filter.value, (value) =>
                updateFilter(group.id, filterIndex, "value", value)
              )}
              <Button
                variant="destructive"
                size={"sm"}
                className="h-8 px-2"
                onClick={() => removeFilter(group.id, filterIndex)}
              >
                <Trash2 />
                <RippleEffect className="bg-foreground/50" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Subgroups */}
      {group.subgroups.map((subgroup: FilterGroup) => (
        <FilterGroupComponent
          key={subgroup.id}
          group={subgroup}
          filterColumns={filterColumns}
          addFilter={addFilter}
          removeFilter={removeFilter}
          updateFilter={updateFilter}
          addSubgroup={addSubgroup}
          removeSubgroup={removeSubgroup}
          updateGroupType={updateGroupType}
          removeGroup={removeGroup}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export default function AdvancedFilter({
  filterColumns,
  applyFilters,
  onApply,
  setPageIndex,
}: AdvancedFilterProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    { id: 1, type: "$and", filters: [], subgroups: [] },
  ]);

  useEffect(() => {
    if (Object.keys(applyFilters).length > 0) {
      try {
        setFilterGroups(reverseTransformFilters(applyFilters));
        setHasFilters(true);
      } catch (error) {
        console.error("Failed to reverse transform filters:", error);
      }
    }
  }, [applyFilters]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);

  const removeFilterGroup = () => {
    setFilterGroups([{ id: 1, type: "$and", filters: [], subgroups: [] }]);
  };

  const addFilter = (groupId: number) => {
    const addFilterRecursive = (groups: FilterGroup[]): FilterGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            filters: [...group.filters, { field: "", operator: "", value: "" }],
          };
        }
        return { ...group, subgroups: addFilterRecursive(group.subgroups) };
      });
    };
    setFilterGroups(addFilterRecursive(filterGroups));
  };

  const removeFilter = (groupId: number, filterIndex: number) => {
    const removeFilterRecursive = (groups: FilterGroup[]): FilterGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            filters: group.filters.filter((_, index) => index !== filterIndex),
          };
        }
        return { ...group, subgroups: removeFilterRecursive(group.subgroups) };
      });
    };
    setFilterGroups(removeFilterRecursive(filterGroups));
  };

  const updateFilter = (
    groupId: number,
    filterIndex: number,
    key: string,
    value: string
  ) => {
    const updateFilterRecursive = (groups: FilterGroup[]): FilterGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          const updatedFilters = group.filters.map((filter, index) => {
            if (index === filterIndex) {
              return { ...filter, [key]: value };
            }
            return filter;
          });
          return { ...group, filters: updatedFilters };
        }
        return { ...group, subgroups: updateFilterRecursive(group.subgroups) };
      });
    };
    setFilterGroups(updateFilterRecursive(filterGroups));
  };

  const addSubgroup = (groupId: number) => {
    const addSubgroupRecursive = (
      groups: FilterGroup[],
      level: number
    ): FilterGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId && level < 2) {
          return {
            ...group,
            subgroups: [
              ...group.subgroups,
              { id: Date.now(), type: "$and", filters: [], subgroups: [] },
            ],
          };
        }
        return {
          ...group,
          subgroups: addSubgroupRecursive(group.subgroups, level + 1),
        };
      });
    };
    setFilterGroups(addSubgroupRecursive(filterGroups, 0));
  };

  const removeSubgroup = (groupId: number) => {
    const removeSubgroupRecursive = (groups: FilterGroup[]): FilterGroup[] => {
      return groups.map((group) => {
        return {
          ...group,
          subgroups: group.subgroups.filter(
            (subgroup) => subgroup.id !== groupId
          ),
        };
      });
    };
    setFilterGroups(removeSubgroupRecursive(filterGroups));
  };

  const updateGroupType = (groupId: number, type: "$and" | "$or") => {
    const updateGroupTypeRecursive = (groups: FilterGroup[]): FilterGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, type };
        }
        return {
          ...group,
          subgroups: updateGroupTypeRecursive(group.subgroups),
        };
      });
    };
    setFilterGroups(updateGroupTypeRecursive(filterGroups));
  };

  const transformFilters = (groups: FilterGroup[]): any => {
    const transformGroup = (group: FilterGroup): any => {
      // Transform filters into an array instead of an object to preserve duplicates
      const transformedFilters = group.filters.map((filter) => {
        const operatorMap: { [key: string]: string } = {
          "=": "$eq",
          "!=": "$ne",
          contains: "$contains",
          "not contains": "$ncontains",
          startsWith: "$startswith",
          endsWith: "$endswith",
          isnotempty: "$isnotempty",
          isempty: "$isempty",
          isanyof: "$isanyof",
          "<": "$lt",
          "<=": "$lte",
          ">": "$gt",
          ">=": "$gte",
          in: "$in",
        };
        const operator = operatorMap[filter.operator];
        return { [filter.field]: { [operator]: filter.value } };
      });

      // Recursively transform subgroups
      const transformedSubgroups: any[] = group.subgroups.map(transformGroup);

      // Combine filters and subgroups into a single array
      const combined = [...transformedFilters, ...transformedSubgroups];

      // Return null if there are no filters or subgroups
      if (combined.length === 0) {
        return null;
      }

      // Wrap in the group type (e.g., $and or $or)
      return { [group.type]: combined };
    };

    const topLevelGroup = groups[0];
    const transformedTopLevelGroup = transformGroup(topLevelGroup);

    // Return the transformed group directly without extra nesting
    return transformedTopLevelGroup || {};
  };

  const reverseTransformFilters = (transformedFilters: any): FilterGroup[] => {
    const reverseGroup = (
      items: any[],
      id: number,
      type: "$and" | "$or"
    ): FilterGroup => {
      const filters: Filter[] = [];
      const subgroups: FilterGroup[] = [];

      items.forEach((item: any) => {
        if (item.$and || item.$or) {
          const subgroupType = Object.keys(item)[0] as "$and" | "$or";
          subgroups.push(
            reverseGroup(item[subgroupType], Date.now(), subgroupType)
          );
        } else {
          Object.keys(item).forEach((field) => {
            const operatorMap: { [key: string]: string } = {
              $eq: "=",
              $ne: "!=",
              $contains: "contains",
              $ncontains: "not contains",
              $startswith: "startsWith",
              $endswith: "endsWith",
              $isnotempty: "isnotempty",
              $isempty: "isempty",
              $isanyof: "isanyof",
              $lt: "<",
              $lte: "<=",
              $gt: ">",
              $gte: ">=",
              $in: "in",
            };
            const operator = Object.keys(item[field])[0];
            const value = item[field][operator];
            filters.push({
              field,
              operator: operatorMap[operator] || operator, // Fallback to original if not mapped
              value: String(value), // Ensure value is a string
            });
          });
        }
      });

      return { id, type, filters, subgroups };
    };

    if (!transformedFilters || Object.keys(transformedFilters).length === 0) {
      return [{ id: 1, type: "$and", filters: [], subgroups: [] }];
    }

    const topLevelType = Object.keys(transformedFilters)[0] as "$and" | "$or";
    const filtersAndSubgroups = Array.isArray(transformedFilters[topLevelType])
      ? transformedFilters[topLevelType]
      : [];

    return [reverseGroup(filtersAndSubgroups, 1, topLevelType)];
  };

  const applyFilterGroups = () => {
    const transformedFilters = transformFilters(filterGroups);
    if (Object.keys(transformedFilters).length > 0) {
      setPageIndex(0);
      onApply(transformedFilters);
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("page", "0");
      urlParams.set("filters", JSON.stringify(transformedFilters));
      navigate(`?${urlParams.toString()}`, { replace: true });
      setPopoverOpen(false);
      setHasFilters(true);
    }
  };

  const clearFilterGroups = () => {
    setHasFilters(false);
    setFilterGroups([{ id: 1, type: "$and", filters: [], subgroups: [] }]);
    setPageIndex(0);
    onApply({});
    searchParams.delete("filters");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="relative">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size={"sm"} className="h-8 relative">
            <RippleEffect className="bg-foreground/30" />
            <FilterIcon />
            {hasFilters && (
              <div className="absolute -top-[8px] -right-[4px] w-5 h-4 rounded-full bg-primary text-primary-foreground flex justify-center items-center text-[10px] font-bold">
                {filterGroups.reduce(
                  (acc, group) =>
                    acc +
                    group.filters.length +
                    group.subgroups.reduce(
                      (subAcc, subGroup) => subAcc + subGroup.filters.length,
                      0
                    ),
                  0
                )}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-screen sm:max-w-[500px] md:max-w-[600px] max-h-[70vh] overflow-auto p-4 bg-background border rounded-lg shadow-lg"
          align="start"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {hasFilters ? "Edit Filters" : "Add Filters"}
            </h3>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setPopoverOpen(false)}
            >
              <CircleX />
            </Button>
          </div>

          <Separator className="mb-2" />

          {/* Filters Content */}
          <div className="max-h-[50vh] overflow-auto">
            <div className="bg-orange-40">
              {filterGroups.map((group) => (
                <FilterGroupComponent
                  key={group.id}
                  group={group}
                  filterColumns={filterColumns}
                  addFilter={addFilter}
                  removeFilter={removeFilter}
                  updateFilter={updateFilter}
                  addSubgroup={addSubgroup}
                  removeSubgroup={removeSubgroup}
                  updateGroupType={updateGroupType}
                  removeGroup={removeFilterGroup}
                />
              ))}
            </div>
          </div>
          <Separator className="mt-2" />
          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              className="h-8"
              onClick={clearFilterGroups}
            >
              <FilterX className="mr-2" /> Clear
              <RippleEffect className="bg-foreground/30" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8"
              onClick={applyFilterGroups}
            >
              <RippleEffect className="bg-background/50" />
              <FilterIcon className="mr-2" /> Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
