"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/components/language-provider"

export function BannerCarousel() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)

  const bannerData = [
    {
      id: 1,
      title: t("bannerTitle1"),
      description: t("bannerDesc1"),
      image: "/images/product1.jpeg",
      link: "/catalog/id-cards",
    },
    {
      id: 2,
      title: t("bannerTitle2"),
      description: t("bannerDesc2"),
      image: "/images/product2.jpeg",
      link: "/catalog/id-cards",
    },
    {
      id: 3,
      title: t("bannerTitle3"),
      description: t("bannerDesc3"),
      image: "/images/product3.jpeg",
      link: "/catalog/id-cards",
    },
    {
      id: 4,
      title: t("bannerTitle4"),
      description: t("bannerDesc4"),
      image: "/images/product4.jpeg",
      link: "/catalog/id-cards",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden rounded-xl mb-8">
      {bannerData.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h2>
            <p className="text-base md:text-lg mb-6 max-w-md">{slide.description}</p>
            <Link href={slide.link}>
              <Button size="lg">{t("viewButton")}</Button>
            </Link>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              index === currentSlide ? "bg-white" : "bg-white/50",
            )}
            onClick={() => goToSlide(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
