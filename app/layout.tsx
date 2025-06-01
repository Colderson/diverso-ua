import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { CartProvider } from "@/components/cart-provider"
import { ModalProvider } from "@/components/modal-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CartNotification } from "@/components/cart-notification"

// Properly load Nunito font with all required weights
const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Diverso UA – Leather ID Cover Catalog",
  description: "Майстерня гарного настрою. Це не просто ID-картка. Це головний герой. Це — ти.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${nunito.variable} ${nunito.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <CartProvider>
              <ModalProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 bg-gradient-animation dark:bg-background">{children}</main>
                  <Footer />
                </div>
                <ScrollToTop />
                <CartNotification />
              </ModalProvider>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
