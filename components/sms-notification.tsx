"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, MessageSquare } from "lucide-react"

type SmsNotificationProps = {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

export function SmsNotification({ message, type, onClose, duration = 4000 }: SmsNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-white" />
      case "info":
        return <MessageSquare className="h-5 w-5 text-white" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "info":
        return "bg-blue-500"
    }
  }

  if (!message) return null

  return (
    <div
      className={`fixed top-20 right-4 z-[110] ${getBackgroundColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 max-w-sm ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
