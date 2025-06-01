"use client";
import { BannerCarousel } from "@/components/banner-carousel"
import { CategoryGrid } from "@/components/category-grid"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <BannerCarousel />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("categories")}</h2>
        <CategoryGrid />
      </section>

      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("idCardCovers")}</h2>
          <Link href="/catalog/id-cards">
            <Button variant="outline">{t("viewAll")}</Button>
          </Link>
        </div>
        <ProductGrid category="id-cards" limit={8} isHomepage={true} />
      </section>
    </div>
  )
}
