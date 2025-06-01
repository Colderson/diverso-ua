"use client"

import type React from "react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/language-provider"

export function SearchBar() {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (pathname === "/catalog") {
        router.replace(`/catalog?search=${encodeURIComponent(query.trim())}`)
      } else {
        router.push(`/catalog?search=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-md">
      <Input
        type="text"
        placeholder={`${t("search")}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
        <Search className="h-4 w-4" />
        <span className="sr-only">{t("search")}</span>
      </Button>
    </form>
  )
}
