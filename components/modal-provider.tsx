"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { AccountModal } from "@/components/account-modal"

type ModalContextType = {
  showAccountModal: () => void
  hideAccountModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  const showAccountModal = () => setIsAccountModalOpen(true)
  const hideAccountModal = () => setIsAccountModalOpen(false)

  return (
    <ModalContext.Provider value={{ showAccountModal, hideAccountModal }}>
      {children}
      {isAccountModalOpen && (
        <AccountModal
          onClose={hideAccountModal}
          onLoginSuccess={() => {
            // Handle login success if needed
          }}
        />
      )}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
