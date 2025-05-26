import React from "react";

const Footer = () => {
  return (
    <div className="flex shadow-xl bg-background drop-shadow-2xl items-center justify-between p-4 h-24  ">
      <p className="text-gray-700 dark:text-gray-100">
        &copy; {new Date().getFullYear()} Prime Estate. All rights reserved.
      </p>
      <p className="text-gray-700 dark:text-gray-100">
        Developed by Giorgi Patsia
      </p>
    </div>
  );
};

export default Footer;
