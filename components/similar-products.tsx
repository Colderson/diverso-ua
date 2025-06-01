"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/language-provider"

export function SimilarProducts({ currentProductId }: { currentProductId: string }) {
  const { t } = useTranslation()
  const [products, setProducts] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/keycrm-products")
      .then(res => res.json())
      .then(async (data) => {
        const currentProduct = data.find((p: any) => String(p.id) === String(currentProductId))
        if (!currentProduct) return
        setCategoryId(currentProduct.category_id)
        const similar = data
          .filter((p: any) => p.category_id === currentProduct.category_id && String(p.id) !== String(currentProductId))
          .slice(0, 6)

        // Підвантажуємо offers для кожного схожого товару
        const similarWithOffers = await Promise.all(
          similar.map(async (product: any) => {
            const offersRes = await fetch(`/api/keycrm-products/offers?product_id=${product.id}`)
            const offersData = await offersRes.json()
            return { ...product, offers: offersData.data || [] }
          })
        )
        setProducts(similarWithOffers)
      })
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
        {products.map((product) => {
          const minOfferPrice = product.offers && product.offers.length > 0
            ? Math.min(...product.offers.map((o: any) => o.price ?? Infinity))
            : null;
          const displayPrice = minOfferPrice !== null && minOfferPrice !== Infinity
            ? minOfferPrice
            : product.price ?? 0;

          return (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="min-w-[220px] max-w-[220px] flex-shrink-0 hover-lift">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={product.thumbnail_url || (product.attachments_data && product.attachments_data[0]) || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="font-bold text-sm">
                    {displayPrice} ₴
                  </p>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
