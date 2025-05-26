import { getUserPropertiesPaginated } from "@/actions/property.action";
import React from "react";
import PropertyCard from "@/components/PropertyCard";
import PaginationControlsServer from "@/components/Pagination";

// Define the props type for the page component

const MyListingPage = async () => {
  // Get the current page from URL query params (default to 1)
  const itemsPerPage = 10;

  // Call the paginated server action with the current page
  const response = await getUserPropertiesPaginated({
    page: 1,
    limit: itemsPerPage,
  });

  const { properties, pagination } = response;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>

      {/* Check if properties exist and have length */}
      {!properties || properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't created any listings yet.</p>
        </div>
      ) : (
        <>
          {/* Properties grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Show pagination only if we have multiple pages */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <PaginationControlsServer
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />

              {/* Pagination info text */}
              <div className="text-sm text-gray-500 text-center mt-2">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} properties
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyListingPage;
