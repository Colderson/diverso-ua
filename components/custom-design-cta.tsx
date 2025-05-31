import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/language-provider"

export function CustomDesignCTA() {
  const { t } = useTranslation()

  return (
    <div className="bg-muted rounded-xl p-8 text-center my-12">
      <h2 className="text-2xl font-bold mb-4">{t("customDesignCTATitle")}</h2>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t("customDesignCTADescription")}</p>
      <Link href="/custom-design">
        <Button size="lg">{t("customDesignCTAButton")}</Button>
      </Link>
    </div>
  )
}
