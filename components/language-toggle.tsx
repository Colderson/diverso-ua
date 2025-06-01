"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/language-provider"

export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === "uk" ? "en" : "uk")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t("toggleLanguage")}
      className="px-3 py-1 font-medium"
    >
      {language === "uk" ? "UA" : "EN"}
    </Button>
  )
}
