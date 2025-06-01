"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CartContents } from "@/components/cart-contents"
import { useTranslation } from "@/components/language-provider"

export default function CartPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("cart"), href: "/cart" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8">{t("cart")}</h1>

      <CartContents />
    </div>
  )
}
