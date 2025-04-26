import { StudentResponse, columns, filterColumns } from "./columns";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/table/data-table";
import { DataTableViewOptions } from "@/components/table/columnToggle";
import { SortingState } from "@tanstack/react-table";
import { api } from "@/components/api/fetcher";
import { routes } from "@/components/api/route";
import { useBreadcrumb } from "@/components/breadcrumb/BreadcrumbContext";
import { useSearchParams } from "react-router";
import { userAtom } from "@/global/userAtom";
import { useAtom } from "jotai";

export default function Student() {
  {
    /* BreadCrumbs */
  }
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([{ label: "Students" }]);

    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs]);

  {
    /* This is the code to get the filters, sorting, page and page size from the URL */
  }
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("filters")) {
      try {
        setFilters(JSON.parse(searchParams.get("filters")!));
      } catch (error) {
        console.error("Failed to parse filters from URL parameters", error);
        setFilters({});
      }
    }
    if (searchParams.get("sort")) {
      try {
        setSorting(JSON.parse(searchParams.get("sort")!));
      } catch (error) {
        console.error("Failed to parse sorting from URL parameters", error);
        setSorting([]);
      }
    }
    if (searchParams.get("page")) {
      setPageIndex(parseInt(searchParams.get("page")!, 10));
    }
    if (searchParams.get("size")) {
      setPageSize(parseInt(searchParams.get("size")!, 10));
    }
  }, [searchParams]);

  {
    /* This is the code to set the filters, sorting, page and page size in the URL */
  }
  const [totalRows, setTotalRows] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [filters, setFilters] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string>();

  const sortString = sorting
    ?.map(({ id, desc }) => `${id}:${desc ? "desc" : "asc"}`)
    .join(",");

  {
    /* This is the api call */
  }
  const [getuser, _] = useAtom<any>(userAtom)
  const { data, isLoading, error } = api.get<StudentResponse>(
    routes.colleges.student,
    {
      page: pageIndex + 1,
      size: pageSize,
      sort: sortString,
      filters: filters,
    }
  );

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setTotalRows(data.total);
      setTotalPages(data.pages);
      setErrorMessage("");
    }
  }, [data]);

  // This is the code to render the table TitleSpace
  const TitleSpace = (props: any) => {
    const { table } = props;
    return (
      <>
        <DataTableViewOptions table={table} />
      </>
    );
  };

  return (
    <div className="container mx-auto w-full">
      <DataTable
        loading={isLoading}
        error={errorMessage}
        columns={columns}
        data={data?.items ?? []}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        sorting={sorting}
        setSorting={setSorting}
        totalPages={totalPages}
        totalRows={totalRows}
        showFilters={true}
        filterColumns={filterColumns}
        filters={filters}
        setFilters={setFilters}
        CustomHeaderComponent={TitleSpace}
      />
    </div>
  );
}
