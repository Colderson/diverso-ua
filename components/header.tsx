"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Phone, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"
import { useModal } from "@/components/modal-provider"
import { LeaveConfirmationPopup } from "@/components/leave-confirmation-popup"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()
  const { itemCount } = useCart()
  const { showAccountModal } = useModal()
  const [showPhone, setShowPhone] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showCheckoutWarning, setShowCheckoutWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  const isCheckoutPage = pathname === "/checkout"

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)

    // Listen for login state changes
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("loginStateChanged", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("loginStateChanged", handleStorageChange)
    }
  }, [])

  // Block all navigation on checkout page
  useEffect(() => {
    if (isCheckoutPage) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ""
      }

      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault()
        setShowCheckoutWarning(true)
        // Push the current state back to prevent navigation
        window.history.pushState(null, "", window.location.href)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      window.addEventListener("popstate", handlePopState)

      // Push initial state to handle back button
      window.history.pushState(null, "", window.location.href)

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        window.removeEventListener("popstate", handlePopState)
      }
    }
  }, [isCheckoutPage])

  const navItems = [
    { href: "/catalog", label: t("catalog") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ]

  const handleAccountClick = () => {
    if (isCheckoutPage) {
      setShowCheckoutWarning(true)
      return
    }

    if (isLoggedIn) {
      router.push("/profile")
    } else {
      showAccountModal()
    }
  }

  const handleCartClick = (e: React.MouseEvent) => {
    if (isCheckoutPage) {
      e.preventDefault()
      setShowCheckoutWarning(true)
    }
  }

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (isCheckoutPage) {
      e.preventDefault()
      setPendingNavigation(href)
      setShowCheckoutWarning(true)
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isCheckoutPage) {
      e.preventDefault()
      setPendingNavigation("/")
      setShowCheckoutWarning(true)
    }
  }

  const handleCheckoutLeave = () => {
    setShowCheckoutWarning(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
    } else {
      router.push("/")
    }
    setPendingNavigation(null)
  }

  const handleCheckoutStay = () => {
    setShowCheckoutWarning(false)
    setPendingNavigation(null)
  }

  if (isCheckoutPage) {
    // Minimal header for checkout page
    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex h-14 items-center justify-center">
              <button onClick={handleLogoClick} className="flex items-center space-x-3 cursor-pointer">
                <Logo className="h-10 w-10" />
                <span className="font-bold text-3xl brand-font">Diverso</span>
              </button>
            </div>
          </div>
        </header>

        {showCheckoutWarning && (
          <LeaveConfirmationPopup
            title="Ви впевнені?"
            message="Кілька кроків відділяють вас від вашого нового улюбленого чохла на ID-картку."
            confirmText="Так, покинути сторінку"
            cancelText="Ні, продовжити оформлення замовлення"
            onConfirm={handleCheckoutLeave}
            onCancel={handleCheckoutStay}
            confirmVariant="outline"
            cancelVariant="destructive"
          />
        )}
      </>
    )
  }

  // Regular header for other pages
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-8">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Мова</span>
                        <LanguageToggle />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Тема</span>
                        <ThemeToggle />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Телефон</span>
                        <a href="tel:+380932220702" className="text-primary font-medium">
                          093 222 07 02
                        </a>
                      </div>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-10 w-10" />
              <span className="font-bold text-2xl md:text-3xl brand-font">Diverso</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith(item.href) ? "text-primary" : ""
                  }`}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPhone(!showPhone)}
                  aria-label={t("call")}
                  className="relative"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                {showPhone && (
                  <div className="absolute top-full right-0 mt-2 p-3 bg-background border rounded-md shadow-lg whitespace-nowrap z-50">
                    <a href="tel:+380932220702" className="font-medium hover:text-primary">
                      093 222 07 02
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Link href="/cart" onClick={handleCartClick}>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 md:h-9 md:w-9">
                <ShoppingCart className="h-6 w-6 md:h-5 md:w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">{t("cart")}</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleAccountClick}
              aria-label={t("account")}
              className={`relative h-10 w-10 md:h-9 md:w-9 ${isLoggedIn ? "text-primary" : ""}`}
            >
              <User className="h-6 w-6 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
