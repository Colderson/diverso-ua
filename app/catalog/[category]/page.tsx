"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductGrid } from "@/components/product-grid"
import { FilterButtons } from "@/components/filter-buttons"
import { SearchBar } from "@/components/search-bar"
import { CustomDesignCTA } from "@/components/custom-design-cta"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"

export default function CategoryPage() {
  const params = useParams()
  const rawCategory = params?.category || ""
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState("all")

  if (category !== "id-cards") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: t("home"), href: "/" },
            { label: t("catalog"), href: "/catalog" },
            { label: getCategoryName(category, t), href: `/catalog/${category}` },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Цей товар ще поки в розробці</h1>
          <p className="text-muted-foreground mb-8">Вибачте за незручності</p>
          <Link href="/">
            <Button>{t("toHome")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("catalog"), href: "/catalog" },
          { label: getCategoryName(category, t), href: `/catalog/${category}` },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6">{getCategoryName(category, t)}</h1>

      <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <ProductGrid category={category} filter={activeFilter} />

      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />

      <CustomDesignCTA />
    </div>
  )
}

function getCategoryName(category: string, t: (key: string) => string): string {
  const categories: Record<string, string> = {
    "id-cards": t("idCardCovers"),
    wallets: t("wallets"),
    notebooks: t("notebooks"),
    organizers: t("documentOrganizers"),
    accessories: t("leatherAccessories"),
  }

  return categories[category] || category
}
