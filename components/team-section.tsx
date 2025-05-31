import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const team = [
  {
    name: "Олег",
    role: "Співзасновник, технолог",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Максим",
    role: "Співзасновник, маркетолог",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Марія",
    role: "Швея",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Андрій",
    role: "Кожевник",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Микита",
    role: "Оператор лазерного верстату",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export function TeamSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Наша команда</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {team.map((member) => (
          <Card key={member.name} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
