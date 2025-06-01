"use client";
import { useTranslation } from "@/components/language-provider"
import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const reviews = [
  {
    id: 1,
    name_uk: "Катерина Б.",
    name_en: "Kateryna B.",
    avatar: "/reviews/review1.PNG",
    rating: 5,
    text_uk: "Доброго дня, дарувала для брата, йому дуже сподобалося, тому що він на той час переглядав Шрека 😌 Він оцінив такий подарунок, дякую за емоції 🙇🏼‍♀️ ❤️",
    text_en: "Good afternoon, I gave it to my brother, he really liked it because he was watching Shrek at that time 😌 He appreciated such a gift, thank you for the emotions 🙇🏼‍♀️ ❤️",
  },
  {
    id: 2,
    name_uk: "Оксана Л.",
    name_en: "Oksana L.",
    avatar: "/reviews/review2.PNG",
    rating: 5,
    text_uk: "Чохольчик отримала, дякую! 😍😍 Відразу видно, річ зроблена на совість 💪 Саурон на обкладинці виглядає грізно й ефектно, впевнена, подарунок людині сподобається, бо я особисто в захваті ✨✨ ❤️",
    text_en: "I received the cover, thank you! 😍😍 You can immediately see it's made with care 💪 Sauron on the cover looks formidable and impressive, I'm sure the gift will be appreciated, because I'm personally delighted ✨✨ ❤️",
  },
  {
    id: 3,
    name_uk: "Ірина С.",
    name_en: "Iryna S.",
    avatar: "/reviews/review3.PNG",
    rating: 5,
    text_uk: "Доброго вечора) Так, отримала ) Дуже задоволена, якість перевершила очікування, швидкість доставки теж здивувала ) Дуже вдячна Вам 👍😄 ❤️",
    text_en: "Good evening) Yes, I received it ) Very satisfied, the quality exceeded expectations, the delivery speed also surprised me ) Thank you very much 👍😄 ❤️",
  },
  {
    id: 4,
    name_uk: "Тетяна Г.",
    name_en: "Tetiana H.",
    avatar: "/reviews/review4.PNG",
    rating: 5,
    text_uk: "Так, все дуже сподобалось) Це був подарунок чоловіку, він у захваті, ще раз вам дуже дякую 😍😍😍 ❤️",
    text_en: "Yes, everything was great) It was a gift for my husband, he is delighted, thank you very much again 😍😍😍 ❤️",
  },
  {
    id: 5,
    name_uk: "Марина П.",
    name_en: "Maryna P.",
    avatar: "/reviews/review5.PNG",
    rating: 5,
    text_uk: "Доброго дня, це був подарунок для хлопця. Він був приємно вражений!) Якість чудова та концепт незвичайний, дякую 😊 ❤️",
    text_en: "Good afternoon, it was a gift for my boyfriend. He was pleasantly surprised!) The quality is excellent and the concept is unusual, thank you 😊 ❤️",
  },
  {
    id: 6,
    name_uk: "Ольга Д.",
    name_en: "Olha D.",
    avatar: "/reviews/review6.PNG",
    rating: 5,
    text_uk: "Доброго вечора. Нарешті знайшла час відписати. Чохли чудові, дуже круті на дотик 😊 Кожен хто перевіряє мої документи, посміхається і запам’ятовує надовго 😊 Дякую велике ☺️ ❤️",
    text_en: "Good evening. Finally found time to write back. The covers are wonderful, very cool to the touch 😊 Everyone who checks my documents smiles and remembers them for a long time 😊 Thank you so much ☺️ ❤️",
  },
  {
    id: 7,
    name_uk: "Світлана М.",
    name_en: "Svitlana M.",
    avatar: "/reviews/review7.PNG",
    rating: 5,
    text_uk: "Все супер, дуже швидко відправили, якість 💘💦. Дуже дякую!!! ❤️",
    text_en: "Everything is super, sent very quickly, quality 💘💦. Thank you very much!!! ❤️",
  },
]

export default function CustomerReviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { language } = useTranslation()

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
        <h2 className="text-2xl font-bold">{language === "uk" ? "Відгуки клієнтів" : "Customer Reviews"}</h2>
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
                  <Image src={review.avatar || "/placeholder.svg"} alt={review[`name_${language}`] || review.name_uk} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{review[`name_${language}`] || review.name_uk}</h3>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {review[`text_${language}`] || review.text_uk}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}