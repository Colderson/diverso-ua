"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

type ConfirmationPopupProps = {
  message: string
  additionalMessage?: string
  onClose: () => void
}

export function ConfirmationPopup({ message, additionalMessage, onClose }: ConfirmationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden"

    // Fade in
    setIsVisible(true)

    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = "unset"
      setTimeout(onClose, 300) // Wait for fade out animation
    }, 4000)

    // Cleanup on unmount
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    document.body.style.overflow = "unset"
    setTimeout(onClose, 300) // Wait for fade out animation
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()} // Prevent closing on backdrop click
    >
      <div
        className={`bg-background rounded-lg shadow-xl p-8 text-center max-w-md w-full transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-xl font-bold mb-4">{message}</h2>
        {additionalMessage && <p className="text-muted-foreground">{additionalMessage}</p>}
      </div>
    </div>
  )
}
