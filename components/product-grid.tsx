"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"

type Product = {
  id: number
  name: string
  price?: number
  images?: { url: string }[]
  category_id?: number
  subcategory?: string
  // інші поля за потреби
}

const allowedCategoryIds = [6, 7, 8, 9] // Кіно та серіали, Аніме, Ігри, Мультфільми

type ProductGridProps = {
  category: string
  limit?: number
  filter?: string
  isHomepage?: boolean
}

export function ProductGrid({ category, limit, filter, isHomepage = false }: ProductGridProps) {
  const { t } = useTranslation()
  const { addItem, showNotification } = useCart()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (category === "id-cards") {
      fetch("/api/keycrm-products")
        .then(res => res.json())
        .then(data => {
          let filtered = data.filter(
            (product: Product) => allowedCategoryIds.includes(product.category_id ?? 0)
          )
          if (filter && filter !== "all") {
            filtered = filtered.filter((product: Product) => product.subcategory === filter)
          }
          if (limit) {
            filtered = filtered.slice(0, limit)
          }
          setProducts(filtered)
        })
    }
  }, [category, limit, filter])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price ?? 0,
      quantity: 1,
      image: product.images?.[0]?.url || "",
      // інші поля за потреби
    })
    showNotification("Товар доданий у кошик")
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Немає товарів у цій категорії</p>
      </div>
    )
  }

  const gridClass = isHomepage
    ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <div className={`relative ${isHomepage ? "aspect-square" : "aspect-[3/4]"}`}>
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-medium line-clamp-2 text-sm">
                {product.name}
              </h3>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <p className="font-bold text-sm">{product.price} ₴</p>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={(e) => handleAddToCart(product, e)}>
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">{t("addToCart")}</span>
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}