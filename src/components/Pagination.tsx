import React from "react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationControlsServerProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  basePath?: string;
  className?: string;
}

const PaginationControlsServer = ({
  currentPage,
  totalPages,
  siblingCount = 1,
  showFirstLast = true,
  basePath = "",
  className = "",
}: PaginationControlsServerProps) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Create the URL for a specific page
  const getPageUrl = (page: number) => {
    const baseUrl = basePath || window.location.pathname;
    const searchParams = new URLSearchParams();
    searchParams.set("page", page.toString());
    return `${baseUrl}?${searchParams.toString()}`;
  };

  // Generate page numbers to display
  const generatePaginationItems = () => {
    // Maximum number of items to show (excluding first/last/ellipsis)
    const maxItems = siblingCount * 2 + 1;
    const items: React.ReactNode[] = [];

    if (totalPages <= maxItems + 2) {
      // If we have few enough pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(renderPageItem(i));
      }
    } else {
      // Always show first page
      items.push(renderPageItem(1));

      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - siblingCount);
      let endPage = Math.min(totalPages - 1, currentPage + siblingCount);

      // Adjust to ensure we always show maxItems pages in the middle
      if (endPage - startPage < maxItems - 2) {
        if (startPage === 2) {
          endPage = Math.min(totalPages - 1, startPage + maxItems - 2);
        } else if (endPage === totalPages - 1) {
          startPage = Math.max(2, endPage - (maxItems - 2));
        }
      }

      // Add ellipsis if needed before middle section
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(renderPageItem(i));
      }

      // Add ellipsis if needed after middle section
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(renderPageItem(totalPages));
    }

    return items;
  };

  // Render a single page number
  const renderPageItem = (pageNumber: number) => (
    <PaginationItem key={pageNumber}>
      <Link
        href={getPageUrl(pageNumber)}
        className={`flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors ${
          pageNumber === currentPage
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-current={pageNumber === currentPage ? "page" : undefined}
      >
        {pageNumber}
      </Link>
    </PaginationItem>
  );

  return (
    <Pagination className={`my-4 ${className}`}>
      <PaginationContent>
        {/* First Page Button */}
        {showFirstLast && (
          <PaginationItem>
            <Link href={getPageUrl(1)} passHref>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
            </Link>
          </PaginationItem>
        )}

        {/* Previous Button */}
        <PaginationItem>
          <Link
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
            passHref
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
          </Link>
        </PaginationItem>

        {/* Page Numbers */}
        {generatePaginationItems()}

        {/* Next Button */}
        <PaginationItem>
          <Link
            href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
            passHref
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </Link>
        </PaginationItem>

        {/* Last Page Button */}
        {showFirstLast && (
          <PaginationItem>
            <Link href={getPageUrl(totalPages)} passHref>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </Link>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControlsServer;
