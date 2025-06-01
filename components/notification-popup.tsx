"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type NotificationPopupProps = {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function NotificationPopup({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 3000,
}: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden"

    // Fade in
    setIsVisible(true)

    // Auto close
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsVisible(false)
    document.body.style.overflow = "unset"
    setTimeout(onClose, 300) // Wait for fade out animation
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "error":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case "info":
        return <AlertCircle className="h-6 w-6 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()} // Prevent closing on backdrop click
    >
      <div
        className={`${getBackgroundColor()} rounded-lg shadow-xl p-6 max-w-md w-full border transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <p className="text-sm font-medium">{message}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 rounded-full hover:bg-black/10">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
