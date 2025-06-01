"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"
import { mockProducts } from "@/lib/mock-data"

export function ProductDetail({ id }: { id: string }) {
  const { t } = useTranslation()
  const { addItem, showNotification } = useCart()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [showEngravingMessage, setShowEngravingMessage] = useState(false)

  // Find product by ID
  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return <div>Product not found</div>
  }

  // Set default selected color and image
  if (product.colors && product.colors.length > 0 && !selectedColor) {
    setSelectedColor(product.colors[0])
    setSelectedImage(product.image)
  }

  const handleAddToCart = () => {
    if (product) {
      // TO DO: Implement real cart logic with backend integration
      addItem({
        id: product.id,
        name: product.nameKey ? t(product.nameKey) : product.name,
        price: product.price,
        quantity: 1,
        image: selectedImage || product.image,
        color: selectedColor || undefined,
        sku: product.sku,
      })
      showNotification(t("addToCart"))
    }
  }

  const handleAddEngraving = () => {
    if (product) {
      // TO DO: Implement real engraving logic with backend integration
      addItem({
        id: `${product.id}-engraving`,
        name: `${product.nameKey ? t(product.nameKey) : product.name} - ${t("customEngraving")}`,
        price: 50, // Additional price for engraving
        quantity: 1,
        image: selectedImage || product.image,
        color: selectedColor || undefined,
        sku: `${product.sku}-ENG`,
        hasEngraving: true,
      })
      setShowEngravingMessage(true)
      showNotification(t("addEngraving"))
    }
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    // TO DO: Change image based on color selection
    setSelectedImage(product.image)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={selectedImage || product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">{product.nameKey ? t(product.nameKey) : product.name}</h1>

        <div className="text-xl font-bold mb-6">{product.price} ₴</div>

        <div className="prose prose-sm dark:prose-invert mb-6">
          <p>{t("productDescription")}</p>
        </div>

        {product.sku && (
          <div className="text-sm text-muted-foreground mb-6">
            {t("sku")}: {product.sku}
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">{t("color")}</h3>
            <div className="flex space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color ? "border-primary scale-110" : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <Button onClick={handleAddToCart} className="w-full">
            {t("addToCart")}
          </Button>

          <div>
            <Button variant="outline" onClick={handleAddEngraving} className="w-full">
              {t("addEngraving")}
            </Button>
            {showEngravingMessage && (
              <p className="text-sm mt-2" style={{ color: "#FF4242" }}>
                {t("engravingMessage")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
