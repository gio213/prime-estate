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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, Search } from "lucide-react";
import { PropertySearchComponent } from "./PropertSearchComponent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaginationInfo, PropertiesResponse } from "@/types";
import { Property } from "@prisma/client";
import PropertyCard from "./PropertyCard";
import { PaginationControls } from "./PropetyPaginationControl";
import { useAuth } from "@/context/AuthContext";
import AuthFormModal from "./AuthModal";
import { SignInForm } from "./forms/auth/UserLoginForm";

// Server action type definition
type ServerActionParams = {
  page?: number;
  limit?: number;
  type?: string;
  priceMin?: number;
  priceMax?: number;
  for?: string;
  sort?: string;
  order?: "asc" | "desc";
  query?: string;
};

type ServerAction = (params: ServerActionParams) => Promise<PropertiesResponse>;

interface PropertiesListProps {
  // Server action to fetch properties
  fetchAction: ServerAction;
  // Configuration options
  config?: {
    title?: string;
    showAddButton?: boolean;
    addButtonText?: string;
    addButtonPath?: string;
    showFilters?: boolean;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    requireAuth?: boolean; // Whether to show auth modal instead of add button for non-authenticated users
  };
}

export function PropertiesList({
  fetchAction,
  config = {},
}: PropertiesListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Default configuration
  const {
    title = "Properties",
    showAddButton = true,
    addButtonText = "Add Property",
    addButtonPath = "/my-profile/add-property",
    showFilters = true,
    emptyStateTitle = "No properties found",
    emptyStateDescription = "No properties match your current search criteria.",
    requireAuth = false,
  } = config;

  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current page and limit from URL params
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentLimit = parseInt(searchParams.get("limit") || "10");

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

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: ServerActionParams = {
        page: currentPage,
        limit: currentLimit,
      };

      // Add filters from URL
      if (searchParams.get("query")) params.query = searchParams.get("query")!;
      if (searchParams.get("type") && searchParams.get("type") !== "all")
        params.type = searchParams.get("type")!;
      if (searchParams.get("for") && searchParams.get("for") !== "all")
        params.for = searchParams.get("for")!;
      if (searchParams.get("priceMin"))
        params.priceMin = parseFloat(searchParams.get("priceMin")!);
      if (searchParams.get("priceMax"))
        params.priceMax = parseFloat(searchParams.get("priceMax")!);
      if (searchParams.get("sort")) params.sort = searchParams.get("sort")!;
      if (searchParams.get("order"))
        params.order = searchParams.get("order") as "asc" | "desc";

      const response: PropertiesResponse = await fetchAction(params);

      if (response.success && response.properties) {
        setProperties(response.properties);
        setPagination(response.pagination!);
      } else {
        setError(response.message);
        setProperties([]);
        setPagination(null);
      }
    } catch (err) {
      setError("Failed to load properties");
      setProperties([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Load properties when URL params change
  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle limit change
  const handleLimitChange = (limit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {showFilters && <Skeleton className="h-20 w-full" />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {pagination && (
            <p className="text-gray-600 mt-1">
              Showing {(currentPage - 1) * currentLimit + 1} to{" "}
              {Math.min(currentPage * currentLimit, pagination.totalCount)} of{" "}
              {pagination.totalCount} properties
            </p>
          )}
        </div>

        {showAddButton && (
          <>
            {requireAuth && !user ? (
              <AuthFormModal children={<SignInForm />} mode="signIn" />
            ) : (
              <Button onClick={() => router.push(addButtonPath)}>
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
          </>
        )}
      </div>

      {/* Search and Filters Component */}
      {showFilters && <PropertySearchComponent />}

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Show:</span>
          <Select
            value={currentLimit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Properties grid */}
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        !error && (
          <Card className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">{emptyStateTitle}</h3>
            <p className="text-gray-600 mb-4">{emptyStateDescription}</p>
            {showAddButton && (
              <Button onClick={() => router.push(addButtonPath)}>
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
          </Card>
        )
      )}
    </div>
  );
}
