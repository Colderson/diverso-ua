"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/language-provider"
import { mockProducts } from "@/lib/mock-data"

export function SimilarProducts({ currentProductId }: { currentProductId: string }) {
  const { t } = useTranslation()
  const [products, setProducts] = useState<any[]>([])
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get current product to find its category
    const currentProduct = mockProducts.find((p) => p.id === currentProductId)
    if (!currentProduct) return

    // Filter similar products (same category, different ID)
    const similar = mockProducts
      .filter((p) => p.category === currentProduct.category && p.id !== currentProductId)
      .slice(0, 6)

    setProducts(similar)
  }, [currentProductId])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  if (products.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("similarProducts")}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card className="min-w-[220px] max-w-[220px] flex-shrink-0 hover-lift">
              <div className="relative aspect-[3/4]">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2 text-sm">
                  {product.nameKey ? t(product.nameKey) : product.name}
                </h3>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <p className="font-bold text-sm">{product.price} ₴</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
