import { getPropertyById } from "@/actions/property.action";
import PropertyDetails from "@/components/PropertyDetails";
import React, { Suspense } from "react";

// Helper function to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Add artificial delay to test loading state
  await delay(2000); // 2 seconds delay

  const property = await getPropertyById(id);

  if (!property.success) {
    return <div>{property.message}</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <PropertyDetails property={property.property!} />
    </Suspense>
  );
};

export default page;
