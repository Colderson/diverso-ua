"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type LeaveConfirmationPopupProps = {
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  confirmVariant?: "default" | "destructive" | "outline"
  cancelVariant?: "default" | "destructive" | "outline"
}

export function LeaveConfirmationPopup({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmVariant = "outline",
  cancelVariant = "destructive",
}: LeaveConfirmationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden"

    // Fade in
    setIsVisible(true)

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const handleConfirm = () => {
    setIsVisible(false)
    document.body.style.overflow = "unset"
    setTimeout(onConfirm, 300) // Wait for animation to complete
  }

  const handleCancel = () => {
    setIsVisible(false)
    document.body.style.overflow = "unset"
    setTimeout(onCancel, 300) // Wait for animation to complete
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()} // Prevent closing on backdrop click
    >
      <div
        className={`bg-background rounded-lg shadow-xl p-6 max-w-md w-full border transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleCancel} className="h-6 w-6 rounded-full hover:bg-black/10">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex flex-col space-y-3">
          <Button variant={cancelVariant} onClick={handleCancel} className="w-full">
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm} className="w-full">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
