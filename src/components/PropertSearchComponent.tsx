"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, X, ChevronDown, Search } from "lucide-react";

// Property enums - replace with your actual enums
const PropertyType = {
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  LAND: "LAND",
  OFFICE: "OFFICE",
  COMMERCIAL: "COMMERCIAL",
  GARAGE: "GARAGE",
  PARKING: "PARKING",
  STORAGE: "STORAGE",
};

const PropertyFor = {
  RENT: "RENT",
  SALE: "SALE",
};

interface PropertySearchComponentProps {
  onFiltersChange?: (filters: {
    query?: string;
    type?: string;
    for?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) => void;
}

export function PropertySearchComponent({
  onFiltersChange,
}: PropertySearchComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [selectedFor, setSelectedFor] = useState(
    searchParams.get("for") || "all"
  );
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as "asc" | "desc") || "desc"
  );
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  // Create query string function
  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  // Apply filters
  const applyFilters = useCallback(() => {
    const queryString = createQueryString({
      query: searchQuery,
      type: selectedType,
      for: selectedFor,
      priceMin: priceMin,
      priceMax: priceMax,
      sort: sortBy,
      order: sortOrder,
      page: "1", // Reset to first page when filtering
    });

    // Either update URL or call the callback
    if (onFiltersChange) {
      onFiltersChange({
        query: searchQuery || undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        for: selectedFor !== "all" ? selectedFor : undefined,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
        sort: sortBy,
        order: sortOrder,
      });
    } else {
      router.push(`${pathname}?${queryString}`);
    }
  }, [
    searchQuery,
    selectedType,
    selectedFor,
    priceMin,
    priceMax,
    sortBy,
    sortOrder,
    createQueryString,
    router,
    pathname,
    onFiltersChange,
  ]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedFor("all");
    setPriceMin("");
    setPriceMax("");
    setSortBy("createdAt");
    setSortOrder("desc");

    if (onFiltersChange) {
      onFiltersChange({
        sort: "createdAt",
        order: "desc",
      });
    } else {
      router.push(pathname);
    }
  }, [router, pathname, onFiltersChange]);

  // Handle search
  const handleSearch = () => {
    applyFilters();
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    (selectedType && selectedType !== "all") ||
    (selectedFor && selectedFor !== "all") ||
    priceMin ||
    priceMax;

  // Auto-apply filters when they change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filtersPanelOpen) {
        // Only auto-apply if filters are visible
        applyFilters();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    selectedType,
    selectedFor,
    sortBy,
    sortOrder,
    filtersPanelOpen,
    applyFilters,
  ]);

  return (
    <div className=" border rounded-lg shadow-sm">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search properties by name, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Button
            variant="outline"
            onClick={() => setFiltersPanelOpen(!filtersPanelOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform ${
                filtersPanelOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersPanelOpen && (
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Property Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={PropertyType.APARTMENT}>
                    Apartment
                  </SelectItem>
                  <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
                  <SelectItem value={PropertyType.LAND}>Land</SelectItem>
                  <SelectItem value={PropertyType.OFFICE}>Office</SelectItem>
                  <SelectItem value={PropertyType.COMMERCIAL}>
                    Commercial
                  </SelectItem>
                  <SelectItem value={PropertyType.GARAGE}>Garage</SelectItem>
                  <SelectItem value={PropertyType.PARKING}>Parking</SelectItem>
                  <SelectItem value={PropertyType.STORAGE}>Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* For (Rent/Sale) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                For
              </label>
              <Select value={selectedFor} onValueChange={setSelectedFor}>
                <SelectTrigger>
                  <SelectValue placeholder="Rent or Sale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Rent or Sale</SelectItem>
                  <SelectItem value={PropertyFor.RENT}>Rent</SelectItem>
                  <SelectItem value={PropertyFor.SALE}>Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Min */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="Min price"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="Max price"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="rooms">Rooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2 justify-end">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTimeout(applyFilters, 0);
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedType && selectedType !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  text-blue-800">
                Type: {selectedType}
                <button
                  onClick={() => {
                    setSelectedType("all");
                    setTimeout(applyFilters, 0);
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedFor && selectedFor !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  text-blue-800">
                For: {selectedFor}
                <button
                  onClick={() => {
                    setSelectedFor("all");
                    setTimeout(applyFilters, 0);
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(priceMin || priceMax) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  text-blue-800">
                Price: {priceMin || "0"} - {priceMax || "∞"}
                <button
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                    setTimeout(applyFilters, 0);
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
