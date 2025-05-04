"use client";
import { getUserProperties } from "@/actions/property.action";
import React from "react";
import { useState } from "react";
import {
  Home,
  Building,
  Warehouse,
  Landmark,
  Briefcase,
  Car,
  ParkingCircle,
  Package,
  Bath,
  Bed,
  Square,
  Phone,
  ChevronRight,
  MapPin,
  Check,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Properties = Awaited<ReturnType<typeof getUserProperties>>;
export type Property = NonNullable<Properties["properties"]>[number];

// Map for property type icons
const typeIcons: Record<string, React.ReactNode> = {
  APARTMENT: <Building color="#6b7280" size={16} />,
  HOUSE: <Home color="#6b7280" size={16} />,
  LAND: <Landmark color="#6b7280" size={16} />,
  OFFICE: <Briefcase color="#6b7280" size={16} />,
  COMMERCIAL: <Warehouse color="#6b7280" size={16} />,
  GARAGE: <Car color="#6b7280" size={16} />,
  PARKING: <ParkingCircle color="#6b7280" size={16} />,
  STORAGE: <Package color="#6b7280" size={16} />,
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const PropertyCard = ({ property }: { property: Property }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  const propertyFeatures = [
    { name: "Garden", value: property.garden },
    { name: "Balcony", value: property.balcony },
    { name: "Terrace", value: property.terrace },
    { name: "Pool", value: property.pool },
    { name: "A/C", value: property.airConditioning },
    { name: "Heating", value: property.heating },
    { name: "Furnished", value: property.furnished },
    { name: "Elevator", value: property.elevator },
    { name: "Parking", value: property.parking },
  ].filter((feature) => feature.value);

  // Handle carousel navigation
  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImage(
        (prev) => (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg dark:border-primary border-2 overflow-hidden shadow-sm ">
      {/* Image Carousel */}
      <div className="relative w-full h-64">
        {property.images && property.images.length > 0 ? (
          <>
            <div className="w-full h-full">
              <Image
                width={400}
                height={320}
                src={property.images[currentImage]}
                alt={`${property.name} - image ${currentImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-primary p-1 rounded-full"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-primary p-1 rounded-full"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {property.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentImage ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImage(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p>No images available</p>
          </div>
        )}

        {/* Property badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-background text-xs font-semibold  ${
              property.for === "SALE" ? "bg-primary" : "bg-green-500"
            }`}
          >
            For {property.for.charAt(0) + property.for.slice(1).toLowerCase()}
          </span>
          <span className="px-2 py-1 rounded-full text-xs text-black font-semibold bg-gray-100 flex items-center gap-1">
            {typeIcons[property.type] || <Building color="#6b7280" size={16} />}
            {property.type.charAt(0) + property.type.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold truncate w-48">{property.name}</h3>
            <p className="flex items-center truncate w-48  text-sm">
              <MapPin size={14} className="mr-1" />
              {property.location}
            </p>
          </div>
          <div className="text-xl font-bold text-right dark:text-primary">
            {formatCurrency(property.price)}
            {property.for === "RENT" && (
              <span className="text-sm font-normal ">/month</span>
            )}
          </div>
        </div>

        {/* Key features */}
        <div className="flex justify-between mb-4 border-b pb-4">
          <div className="flex items-center gap-1">
            <Bed size={18} className="" />
            <span className="text-sm">
              {property.rooms} {property.rooms === 1 ? "Room" : "Rooms"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} />
            <span className="text-sm">
              {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={18} />
            <span className="text-sm">{property.area} m²</span>
          </div>
        </div>

        {/* Amenities/Features */}
        {propertyFeatures.length > 0 && (
          <div className="flex flex-wrap  gap-2 mb-4">
            {propertyFeatures.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 border   border-gray-200 rounded-full text-xs flex items-center gap-1"
              >
                <Check size={12} className="text-green-500" />
                {feature.name}
              </span>
            ))}
            {propertyFeatures.length > 4 && (
              <span className="px-2 py-1 border border-gray-200 rounded-full text-xs">
                +{propertyFeatures.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between pt-2 border-t">
          <button className="px-4 py-2 border   border-gray-200 rounded-md flex items-center gap-1 hover:bg-gray-50">
            <Phone size={16} />
            <span className="truncate w-24"> {property.sellerPhone}</span>
          </button>
          <Button
            onClick={() => router.push(`/property-details/${property.id}`)}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-1 hover:cursor-pointer hover:bg-primary/80"
          >
            {" "}
            View Details
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
