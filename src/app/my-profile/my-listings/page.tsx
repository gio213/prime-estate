import React, { Suspense } from "react";
import { PropertiesList } from "@/components/PropertiesList";
import { getUserPropertiesPaginated } from "@/actions/property.action";

// Define the props type for the page component

const MyListingPage = async () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PropertiesList fetchAction={getUserPropertiesPaginated} />
      </Suspense>
    </div>
  );
};

export default MyListingPage;
