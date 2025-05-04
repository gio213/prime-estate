import { getUserProperties } from "@/actions/property.action";
import React from "react";
import PropertyCard from "@/components/PropertyCard";
const myListingPage = async () => {
  const { properties } = await getUserProperties();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default myListingPage;
