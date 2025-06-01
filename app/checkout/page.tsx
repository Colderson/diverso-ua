"use client"

import { CheckoutForm } from "@/components/checkout-form"
import { useTranslation } from "@/components/language-provider"

export default function CheckoutPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("checkout")}</h1>
      <CheckoutForm />
    </div>
  )
}
