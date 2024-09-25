import React, { useState } from "react";
import { Buyer } from "@/components/Buyer";
import { Seller } from "@/components/Seller";
import { Company } from "@/components/Company";

export function ThreeWaySwitch() {
  const [activeIndex, setActiveIndex] = useState(0);

  const components = [
    { label: "Buyer", component: <Buyer /> },
    { label: "Seller", component: <Seller /> },
    { label: "Company", component: <Company /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Toggle Buttons */}
      <div className="flex space-x-2">
        {components.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded ${
              index === activeIndex ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Render the active component */}
      <div className="mt-8">
        {components[activeIndex].component}
      </div>
    </div>
  );
}
