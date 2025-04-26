import { useBreadcrumb } from "@/components/breadcrumb/BreadcrumbContext";
import { useEffect } from "react";

function Dashboard() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard"}
    ]);

    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs]);
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted md:min-h-min" />
    </div>
  )
}

export default Dashboard