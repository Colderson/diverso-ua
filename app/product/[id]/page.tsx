"use client"

import React from "react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductDetail } from "@/components/product-detail"
import { SimilarProducts } from "@/components/similar-products"
import { useTranslation } from "@/components/language-provider"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("catalog"), href: "/catalog" },
          { label: t("idCardCovers"), href: "/catalog/id-cards" },
          { label: t("productDetails"), href: `/product/${resolvedParams.id}` },
        ]}
      />

      <ProductDetail id={resolvedParams.id} />
    </div>
  )
}
