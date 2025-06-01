"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CustomDesignForm } from "@/components/custom-design-form"
import { useTranslation } from "@/components/language-provider"

export default function CustomDesignPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("customDesignOrder"), href: "/custom-design" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t("customDesignTitle")}</h1>
        <p className="mb-8 text-muted-foreground">{t("customDesignDescription")}</p>

        <CustomDesignForm />
      </div>
    </div>
  )
}
