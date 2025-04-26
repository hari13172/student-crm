import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "react-router";
import React from "react";
import { useBreadcrumb } from "./BreadcrumbContext";

function CustomBreadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.length <= 2 ? (
          // If there are 2 or fewer segments, show them directly
          breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <Link to={item.href}>{item.label}</Link>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))
        ) : (
          // If there are more than 2 segments, collapse the middle segments into a dropdown
          <>
            {/* First breadcrumb item */}
            <BreadcrumbItem>
              <Link to={breadcrumbs[0].href || "/"}>
                {breadcrumbs[0].label}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Dropdown for collapsed breadcrumbs */}
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {breadcrumbs.slice(1, -1).map((item, index) => (
                    <DropdownMenuItem key={index}>
                      <Link to={item.href || "/"}>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Last breadcrumb item (current page) */}
            <BreadcrumbItem>
              <BreadcrumbPage>
                {breadcrumbs[breadcrumbs.length - 1].label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default CustomBreadcrumb;
