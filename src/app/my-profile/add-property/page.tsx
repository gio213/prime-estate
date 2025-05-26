import { PropertyForm } from "@/components/forms/PropertyForm";
import React from "react";

export const metadata = {
  title: "Add Property",
  description: "Add Property",
};

const addPropertyPage = async () => {
  return (
    <div>
      <PropertyForm />
    </div>
  );
};

export default addPropertyPage;
