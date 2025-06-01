"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/components/language-provider"

export function Pagination() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [showMore, setShowMore] = useState(false)
  const totalPages = 25 // Simulate many pages for scalable design

  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 4) {
        // Show pages 2, 3, 4, 5, ..., last
        pages.push(2, 3, 4, 5, "...", totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        // Show 1, ..., current-1, current, current+1, ..., last
        pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }

      // Ensure we always have exactly 7 buttons (including dots)
      while (pages.length < maxVisible && pages.length < totalPages) {
        if (pages[pages.length - 2] !== "...") {
          pages.splice(-1, 0, "...")
        }
      }
    }

    return pages
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      setCurrentPage(page)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleDotsClick = (position: "start" | "end") => {
    if (position === "start") {
      setCurrentPage(Math.max(1, currentPage - 5))
    } else {
      setCurrentPage(Math.min(totalPages, currentPage + 5))
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 my-8">
      <div className="flex items-center space-x-2">
        <Checkbox id="showMore" checked={showMore} onCheckedChange={setShowMore} />
        <Label htmlFor="showMore">{t("showMoreOnPage")}</Label>
      </div>

      {!showMore && (
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("previous")}</span>
          </Button>

          {/* Page numbers */}
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDotsClick(index < 3 ? "start" : "end")}
                  className="px-3 py-2 hover:bg-muted"
                >
                  ...
                </Button>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1"
          >
            <span className="hidden sm:inline">{t("next")}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
