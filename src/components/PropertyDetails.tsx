import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ArrowRightIcon,
  BedIcon,
  BathIcon,
  CarIcon,
  HomeIcon,
  PhoneIcon,
  DollarSignIcon,
  HeartIcon,
  ShareIcon,
  ArrowUpToLine,
  LocationEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Property } from "@prisma/client";
import GoogleMapsPlaceDetails from "./GoogleMap";
import { env } from "@/lib/env";

const PropertyDetails = ({ property }: { property: Property }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Function to determine badge color based on property status
  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-green-500" : "bg-red-500";
  };

  // Function to determine badge color based on property type
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      APARTMENT: "bg-blue-500",
      HOUSE: "bg-purple-500",
      LAND: "bg-emerald-500",
      OFFICE: "bg-orange-500",
      COMMERCIAL: "bg-pink-500",
      GARAGE: "bg-slate-500",
      PARKING: "bg-yellow-500",
      STORAGE: "bg-cyan-500",
    };
    return typeColors[type] || "bg-gray-500";
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Property Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl dark:text-primary font-bold">
            {property.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <ArrowRightIcon className="h-4 w-4 text-gray-500" />
            <p className="text-gray-500">{property.location}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(property.price)}
            {property.for === "RENT" && (
              <span className="text-sm text-gray-500 ml-1">/month</span>
            )}
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={`${getStatusColor(property.status!)} text-white`}
            >
              {property.status}
            </Badge>
            <Badge
              variant="outline"
              className={`${getTypeColor(property.type)} text-white`}
            >
              {property.type}
            </Badge>
            <Badge variant="outline" className="bg-indigo-500 text-white">
              FOR {property.for}
            </Badge>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {property.images.length > 0 ? (
              property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-96 w-full rounded-lg overflow-hidden">
                    <img
                      src={image || "/api/placeholder/800/600"}
                      alt={`Property image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="h-96 w-full bg-slate-200 rounded-lg flex items-center justify-center">
                  <HomeIcon className="h-20 w-20 text-slate-400" />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Quick action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full h-10 w-10 bg-white bg-opacity-80 hover:bg-opacity-100"
          >
            <HeartIcon className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full h-10 w-10 bg-white bg-opacity-80 hover:bg-opacity-100"
          >
            <ShareIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Property Details */}
        <div className="md:col-span-2 space-y-8">
          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="w-full ">
            <TabsList className="grid w-full grid-cols-3 ">
              <TabsTrigger className="hover:cursor-pointer " value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="hover:cursor-pointer" value="details">
                Details
              </TabsTrigger>
              <TabsTrigger className="hover:cursor-pointer" value="amenities">
                Amenities
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className=" whitespace-pre-line">{property.description}</p>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="">
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <ArrowUpToLine className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-gray-500">Area</span>
                      <span className="font-semibold">{property.area} m²</span>
                    </CardContent>
                  </Card>
                  <Card className="">
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <BedIcon className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <span className="font-semibold">{property.rooms}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <BathIcon className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-gray-500">Bathrooms</span>
                      <span className="font-semibold">
                        {property.bathrooms}
                      </span>
                    </CardContent>
                  </Card>
                  {property.garage && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <CarIcon className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm text-gray-500">Garage</span>
                        <span className="font-semibold">
                          {property.garage}{" "}
                          {property.garage > 1 ? "spaces" : "space"}
                        </span>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium">{property.type}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">For</span>
                      <span className="font-medium">{property.for}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium">{property.status}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Area</span>
                      <span className="font-medium">{property.area} m²</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Bedrooms</span>
                      <span className="font-medium">{property.rooms}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Bathrooms</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    {property.garage !== undefined && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Garage</span>
                        <span className="font-medium">{property.garage}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Listed on</span>
                      <span className="font-medium">
                        {formatDate(property.createdAt)}
                      </span>
                    </div>
                    {property.expiresAt && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Available until</span>
                        <span className="font-medium">
                          {formatDate(property.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Garden", value: property.garden },
                      { label: "Balcony", value: property.balcony },
                      { label: "Terrace", value: property.terrace },
                      { label: "Pool", value: property.pool },
                      {
                        label: "Air Conditioning",
                        value: property.airConditioning,
                      },
                      { label: "Heating", value: property.heating },
                      { label: "Furnished", value: property.furnished },
                      { label: "Elevator", value: property.elevator },
                      { label: "Parking", value: property.parking },
                    ].map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            amenity.value ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={
                            amenity.value ? "font-medium" : "text-gray-500"
                          }
                        >
                          {amenity.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Location */}
          {/* <div>
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <div className=" bg-accent h-64 rounded-lg flex items-center justify-center">
              <LocationEdit className="h-10 w-10 text-slate-400 mr-2" />
              <span className="text-slate-400">Map: {property.location}</span>
            </div>
          </div> */}
          <GoogleMapsPlaceDetails
            apiKey={env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
            address={property.location}
          />
        </div>

        {/* Right Column: Contact Information */}
        <div className="space-y-4">
          {/* Seller Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Seller</CardTitle>
              <CardDescription>
                Property listed by {property.sellerName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary text-white">
                    {property.sellerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{property.sellerName}</p>
                  <p className="text-sm text-gray-500">Property Owner</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{property.sellerPhone}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property Financial Card */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Price</span>
                <span className="font-bold">
                  {formatCurrency(property.price)}
                </span>
              </div>
              {property.for === "RENT" && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Annual</span>
                  <span className="font-medium">
                    {formatCurrency(property.price * 12)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Price per m²</span>
                <span className="font-medium">
                  {formatCurrency(property.price / property.area)}
                </span>
              </div>

              <Separator className="my-2" />

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <DollarSignIcon className="h-4 w-4 mr-2" />
                    <span>View Mortgage Options</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Estimated Monthly Payment</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">30-year fixed</span>
                      <span className="font-medium">
                        {formatCurrency((property.price / 360) * 1.3)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">15-year fixed</span>
                      <span className="font-medium">
                        {formatCurrency((property.price / 180) * 1.2)}/mo
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      *Estimated payments with 20% down payment
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
