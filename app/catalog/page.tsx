"use client"

import { CategoryGrid } from "@/components/category-grid"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useTranslation } from "@/components/language-provider"

export default function CatalogPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("catalog"), href: "/catalog" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-8">{t("catalog")}</h1>
      <CategoryGrid />
    </div>
  )
}
