"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"
import { useTranslation } from "@/components/language-provider"

export function Footer() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const isCheckoutPage = pathname === "/checkout"

  if (isCheckoutPage) {
    // Minimal footer for checkout page
    return (
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Diverso UA. {t("allRightsReserved")}
          </p>
        </div>
      </footer>
    )
  }

  // Regular footer for other pages
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Diverso UA</h3>
            <p className="text-muted-foreground mb-4">{t("footerDescription")}</p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("navigation")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-primary">
                  {t("catalog")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/custom-design" className="text-muted-foreground hover:text-primary">
                  {t("customDesign")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("contacts")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <a
                  href="https://maps.app.goo.gl/XfXY5y3kvccYDLpJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("address")}
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="tel:+380932220702" className="text-muted-foreground hover:text-primary">
                  093 222 07 02
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="mailto:diverso.ua.2024@gmail.com" className="text-muted-foreground hover:text-primary">
                  diverso.ua.2024@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("workingHours")}</h3>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">{t("workingTime")}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Diverso UA. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
