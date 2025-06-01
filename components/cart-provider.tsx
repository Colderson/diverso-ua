"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export type CartItem = {
  id: string
  cartId: string // ← Додаємо!
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  sku?: string
  hasEngraving?: boolean
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  notification: string | null
  showNotification: (message: string) => void
  hideNotification: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  // console.log("CartProvider mounted", Math.random()) // ← Видалити або закоментувати
  const [items, setItems] = useState<CartItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false) // Додаємо прапорець

  // Load cart from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Failed to parse cart from localStorage")
          setItems([])
        }
      } else {
        setItems([]) // <-- Додаємо!
      }
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage when it changes, але тільки після першого завантаження
  useEffect(() => {
    if (!isLoaded) return
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items))
    } else {
      localStorage.removeItem("cart")
    }
  }, [items, isLoaded])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const addItem = (item: CartItem) => {
    console.log("addItem called", item)
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.cartId === item.cartId,
      )

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (cartId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const showNotification = (message: string) => {
    setNotification(message)
  }

  const hideNotification = () => {
    setNotification(null)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        notification,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
