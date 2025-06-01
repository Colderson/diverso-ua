"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const bannerData = [
  {
    id: 1,
    title: "Чохли на ID-карти",
    description: "Унікальні дизайни для вашої ID-картки",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/catalog",
  },
  {
    id: 2,
    title: "Гаманці",
    description: "Стильні шкіряні гаманці ручної роботи",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/catalog",
  },
  {
    id: 3,
    title: "Блокноти",
    description: "Шкіряні блокноти для ваших ідей",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/catalog",
  },
  {
    id: 4,
    title: "Шкіряні аксесуари",
    description: "Доповніть свій стиль унікальними аксесуарами",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/catalog",
  },
]

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)

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
    <div className="relative w-full h-[400px] md:h-[500px] mb-12 overflow-hidden rounded-xl">
      {bannerData.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h2>
            <p className="text-lg md:text-xl mb-6 max-w-md">{slide.description}</p>
            <Link href={slide.link}>
              <Button size="lg">Переглянути</Button>
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
