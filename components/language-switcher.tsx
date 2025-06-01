"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "./language-provider"

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <div className="flex items-center space-x-1 border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        className={`px-2 py-1 rounded-none ${language === "uk" ? "bg-muted" : ""}`}
        onClick={() => setLanguage("uk")}
      >
        UA
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-2 py-1 rounded-none ${language === "en" ? "bg-muted" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  )
}
