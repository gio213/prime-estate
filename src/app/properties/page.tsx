import { getPropertiesPaginated } from "@/actions/property.action";
import { PropertiesList } from "@/components/PropertiesList";
import { Suspense } from "react";

export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PropertiesList
          fetchAction={getPropertiesPaginated}
          config={{
            showFilters: true,
            title: "Properties",
          }}
        />
      </Suspense>
    </div>
  );
}
