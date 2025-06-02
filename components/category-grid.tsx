import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/components/language-provider"

const categories = [
  {
    id: "id-cards",
    name: "idCardCovers",
    image: "/images/product1-1.jpeg",
    link: "/catalog/id-cards",
  },
  {
    id: "wallets",
    name: "wallets",
    image: "/images/categories/wallets.webp",
    link: "/catalog/wallets",
  },
  {
    id: "notebooks",
    name: "notebooks",
    image: "/images/categories/notebooks.jpeg",
    link: "/catalog/notebooks",
  },
  {
    id: "organizers",
    name: "documentOrganizers",
    image: "/images/categories/organizers.webp",
    link: "/catalog/organizers",
  },
  {
    id: "accessories",
    name: "leatherAccessories",
    image: "/images/categories/accessories.jpeg",
    link: "/catalog/accessories",
  },
]

export function CategoryGrid() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={category.link}>
          <Card className="overflow-hidden transition-all hover:shadow-md h-full">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={t(category.name)}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center min-h-[60px] flex items-center justify-center">
                <h3 className="font-medium text-sm leading-tight">{t(category.name)}</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
