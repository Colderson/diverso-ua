"use client";
import { BannerCarousel } from "@/components/banner-carousel"
import { CategoryGrid } from "@/components/category-grid"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const reviews = [
  {
    id: 1,
    name: "Катерина Б.",
    avatar: "/reviews/review1.png",
    rating: 5,
    text: "Доброго дня, дарувала для брата, йому дуже сподобалося, тому що він на той час переглядав Шрека 😌 Він оцінив такий подарунок, дякую за емоції 🙇🏼‍♀️ ❤️",
  },
  {
    id: 2,
    name: "Оксана Л.",
    avatar: "/reviews/review2.png",
    rating: 5,
    text: "Чохольчик отримала, дякую! 😍😍 Відразу видно, річ зроблена на совість 💪 Саурон на обкладинці виглядає грізно й ефектно, впевнена, подарунок людині сподобається, бо я особисто в захваті ✨✨ ❤️",
  },
  {
    id: 3,
    name: "Ірина С.",
    avatar: "/reviews/review3.png",
    rating: 5,
    text: "Доброго вечора) Так, отримала ) Дуже задоволена, якість перевершила очікування, швидкість доставки теж здивувала ) Дуже вдячна Вам 👍😄 ❤️",
  },
  {
    id: 4,
    name: "Тетяна Г.",
    avatar: "/reviews/review4.png",
    rating: 5,
    text: "Так, все дуже сподобалось) Це був подарунок чоловіку, він у захваті, ще раз вам дуже дякую 😍😍😍 ❤️",
  },
  {
    id: 5,
    name: "Марина П.",
    avatar: "/reviews/review5.png",
    rating: 5,
    text: "Доброго дня, це був подарунок для хлопця. Він був приємно вражений!) Якість чудова та концепт незвичайний, дякую 😊 ❤️",
  },
  {
    id: 6,
    name: "Ольга Д.",
    avatar: "/reviews/review6.png",
    rating: 5,
    text: "Доброго вечора. Нарешті знайшла час відписати. Чохли чудові, дуже круті на дотик 😊 Кожен хто перевіряє мої документи, посміхається і запам’ятовує надовго 😊 Дякую велике ☺️ ❤️",
  },
  {
    id: 7,
    name: "Світлана М.",
    avatar: "/reviews/review7.png",
    rating: 5,
    text: "Все супер, дуже швидко відправили, якість 💘💦. Дуже дякую!!! ❤️",
  },
]

function CustomerReviews() {
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

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <BannerCarousel />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("categories")}</h2>
        <CategoryGrid />
      </section>

      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("idCardCovers")}</h2>
          <Link href="/catalog/id-cards">
            <Button variant="outline">{t("viewAll")}</Button>
          </Link>
        </div>
        <ProductGrid category="id-cards" limit={8} isHomepage={true} />
      </section>

      <CustomerReviews />
    </div>
  )
}