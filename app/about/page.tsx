"use client"

import Image from "next/image"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useTranslation } from "@/components/language-provider"

const team = [
  {
    name: "Олег",
    role: "coFounderTechnologist",
    image: "/images/team/oleg.jpeg",
  },
  {
    name: "Максим",
    role: "coFounderMarketer",
    image: "/images/team/max.jpeg",
  },
  {
    name: "Марія",
    role: "seamstress",
    image: "/images/team/seamstress.jpeg",
  },
  {
    name: "Андрій",
    role: "leatherWorker",
    image: "/images/team/leatherworker.jpeg",
  },
  {
    name: "Микита",
    role: "laserOperator",
    image: "/images/team/operator.jpeg",
  },
]

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("about"), href: "/about" },
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("aboutTitle")}</h1>

        <div className="prose max-w-none dark:prose-invert">
          <p className="text-lg mb-6">{t("aboutDescription")}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t("ourTeam")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{t(member.role)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
