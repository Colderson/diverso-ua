import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// Sample data for ID card covers
const products = [
  {
    id: "1",
    name: "Чохол на ID-картку 'Гаррі Поттер'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "movies",
  },
  {
    id: "2",
    name: "Чохол на ID-картку 'Наруто'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "anime",
  },
  {
    id: "3",
    name: "Чохол на ID-картку 'Сімпсони'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "cartoons",
  },
  {
    id: "4",
    name: "Чохол на ID-картку 'Відьмак'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "games",
  },
  {
    id: "5",
    name: "Чохол на ID-картку 'Друзі'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "movies",
  },
  {
    id: "6",
    name: "Чохол на ID-картку 'Атака титанів'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "anime",
  },
  {
    id: "7",
    name: "Чохол на ID-картку 'Рік і Морті'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "cartoons",
  },
  {
    id: "8",
    name: "Чохол на ID-картку 'The Last of Us'",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    category: "games",
  },
]

export function CategoryView() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <div className="relative aspect-[3/4]">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-medium line-clamp-2">{product.name}</h3>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="font-bold">{product.price} ₴</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
