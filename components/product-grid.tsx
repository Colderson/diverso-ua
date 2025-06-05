"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"
import { Pagination } from "@/components/pagination"

type Product = {
  id: number
  name: string
  price?: number
  images?: { url: string }[]
  category_id?: number
  subcategory?: string
  variants?: { price: number }[]
  thumbnail_url?: string
  attachments_data?: string[]
  min_price?: number
  max_price?: number
  sku?: string
  // інші поля за потреби
}

const allowedCategoryIds = [6, 7, 8, 9] // Кіно та серіали, Аніме, Ігри, Мультфільми

type ProductGridProps = {
  category: string
  limit?: number
  filter?: string
  isHomepage?: boolean
}

const PRODUCTS_PER_PAGE = 12;

const filterMap: Record<string, number[]> = {
  all: [6, 7, 8, 9],
  movies: [6],
  anime: [7],
  games: [8],
  cartoons: [9],
}

export function ProductGrid({ category, limit, filter, isHomepage = false }: ProductGridProps) {
  const { t } = useTranslation()
  const { addItem, showNotification } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1);

  // Скидаємо сторінку при зміні фільтра або категорії
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, category]);

  useEffect(() => {
    if (category === "id-cards") {
      fetch("/api/keycrm-products")
        .then(res => res.json())
        .then(data => {
          let filtered = data.filter(
            (product: Product) => allowedCategoryIds.includes(product.category_id ?? 0)
          )
          if (filter && filter !== "all" && filterMap[filter]) {
            filtered = filtered.filter((product: Product) =>
              filterMap[filter].includes(product.category_id ?? 0)
            )
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
      cartId: `${product.id}-${""}-`, // завжди такий формат!
      name: product.name,
      price: product.price ?? 0,
      quantity: 1,
      image:
        product.thumbnail_url ||
        product.images?.[0]?.url ||
        (product.attachments_data && product.attachments_data[0]) ||
        "/placeholder.svg",
      sku: product.sku ?? "",
    })
    showNotification(t("addToCart2"))
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Немає товарів у цій категорії</p>
      </div>
    )
  }

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const gridClass = isHomepage
    ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"

  const shownProducts = isHomepage
    ? products.slice(0, 8)
    : paginatedProducts;

  return (
    <>
      <div className={gridClass}>
        {shownProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <Link href={`/product/${product.id}`}>
              <div className="relative aspect-square">
                <Image
                  src={
                    product.thumbnail_url ||
                    (product.attachments_data && product.attachments_data[0]) ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-medium line-clamp-2 text-sm">
                {product.name}
              </h3>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <p className="font-bold text-sm">
                {product.variants?.[0]?.price ?? product.price ?? product.min_price ?? product.max_price ?? 0} ₴
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product, e);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">{t("addToCart")}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!isHomepage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}
