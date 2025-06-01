"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const reviews = [
  {
    id: 1,
    name: "Олена К.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Замовляла чохол на ID-картку з дизайном улюбленого серіалу. Якість чудова, доставка швидка. Дуже задоволена покупкою!",
  },
  {
    id: 2,
    name: "Максим П.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Купив гаманець як подарунок для друга. Шкіра високої якості, приємно пахне. Друг був у захваті. Рекомендую!",
  },
  {
    id: 3,
    name: "Анна В.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "Замовила блокнот з індивідуальним дизайном. Результат перевершив очікування. Єдиний мінус - довго чекала на виготовлення.",
  },
  {
    id: 4,
    name: "Ігор Т.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Чохол на ID-картку з аніме дизайном просто бомба! Всі друзі питають, де я його взяв. Однозначно буду замовляти ще.",
  },
  {
    id: 5,
    name: "Марія С.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Органайзер для документів дуже зручний і стильний. Тепер всі документи в порядку. Дякую за якісний товар!",
  },
]

export function CustomerReviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Відгуки клієнтів</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={scrollLeft}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => (
          <Card key={review.id} className="min-w-[300px] max-w-[300px] flex-shrink-0">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src={review.avatar || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{review.name}</h3>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{review.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
