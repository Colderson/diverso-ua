"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function CartNotification() {
  const { notification, hideNotification } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(hideNotification, 300) // Wait for animation to complete
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [notification, hideNotification])

  if (!notification) return null

  return (
    <div
      className={`fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      <CheckCircle className="h-5 w-5" />
      <span>{notification}</span>
    </div>
  )
}
