"use client"

import type React from "react"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  onNavigate?: (path: string) => void
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  const handleClick = (e: React.MouseEvent, href: string) => {
    if (onNavigate) {
      e.preventDefault()
      onNavigate(href)
    }
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}

            {index === items.length - 1 ? (
              <span className="text-muted-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-primary hover:text-primary/80"
                onClick={(e) => handleClick(e, item.href)}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
