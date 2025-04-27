import FuzzyText from "@/components/FuzzyText";
import React from "react";

const notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <FuzzyText color="#1a73e8" baseIntensity={0.2}>
        404 not found
      </FuzzyText>
    </div>
  );
};

export default notfound;
