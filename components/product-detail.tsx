"use client"
import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"
import { SimilarProducts } from "@/components/similar-products"

interface ColorOption {
  name: string
  color: string
  hex: string
}

interface OfferProperty {
  name: string
  value: string
}

interface Offer {
  sku: string
  price: number
  thumbnail_url?: string // ← додайте це поле!
  image_url?: string
  properties?: OfferProperty[]
  product_id?: string | number
}

interface Product {
  id: string | number
  name: string
  price?: number
  sku?: string
  thumbnail_url?: string
  description?: string
  attachments_data?: string[]
}

const colorOptions = [
  { name: "Чорний", color: "black", hex: "#222" },
  { name: "Чорний", color: "чорний", hex: "#222" },
  { name: "Коричневий", color: "brown", hex: "#8B5C2A" },
  { name: "Коричневий", color: "коричневий", hex: "#8B5C2A" },
  { name: "Зелений", color: "green", hex: "#3B7A57" },
  { name: "Зелений", color: "зелений", hex: "#3B7A57" },
  { name: "Рожевий", color: "pink", hex: "#E75480" },
  { name: "Рожевий", color: "рожевий", hex: "#E75480" },
  { name: "Червоний", color: "red", hex: "#C0392B" },
  { name: "Червоний", color: "червоний", hex: "#C0392B" },
  // Додавайте інші варіанти, які реально приходять з API
]

export function ProductDetail({ id }: { id: string }) {
  const { t } = useTranslation()
  const { addItem, showNotification, items } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [showEngravingMessage, setShowEngravingMessage] = useState(false)

  // Завантаження продукту та варіантів
  useEffect(() => {
    fetch("/api/keycrm-products")
      .then(res => res.json())
      .then((data) => {
        const found = data.find((p: any) => String(p.id) === String(id))
        setProduct(found || null)
      })
    fetch(`/api/keycrm-products/offers?product_id=${id}`)
      .then(res => res.ok ? res.json() : { data: [] })
      .then((data) => {
        setOffers(data.data || [])
      })
  }, [id])

  // Фільтруємо offers для поточного товару
  const filteredOffers = offers.filter((offer: Offer) => String(offer.product_id) === String(id));
  const baseOffer = filteredOffers[0] || null;

  // Встановлюємо selectedOffer за замовчуванням
  useEffect(() => {
    if (filteredOffers.length > 0) {
      // Якщо selectedColor вже вибраний, шукаємо відповідний offer
      if (selectedColor) {
        const offer = filteredOffers.find(o =>
          o.properties?.some(
            p => (p.name.toLowerCase() === "color" || p.name.toLowerCase() === "колір") &&
                 p.value.toLowerCase() === selectedColor.toLowerCase()
          )
        );
        if (offer) {
          setSelectedOffer(offer);
          return;
        }
      }
      setSelectedOffer(filteredOffers[0]);
      const colorProp = filteredOffers[0].properties?.find(
        prop => prop.name.toLowerCase() === "color" || prop.name.toLowerCase() === "колір"
      )?.value;
      setSelectedColor(colorProp || null);
    } else {
      setSelectedOffer(null);
      setSelectedColor(null);
    }
    setSelectedImageIndex(0);
  }, [filteredOffers])

  useEffect(() => {
    console.log("offers from API:", offers)
    console.log("filteredOffers:", filteredOffers)
    console.log("product_id:", id)
  }, [offers, filteredOffers, id])

  // Галерея (useMemo має бути ДО if (!product))
  const images = useMemo(() => {
    // Збираємо всі фото з offers (тільки унікальні)
    const offerImages = filteredOffers
      .map(o => o.thumbnail_url)
      .filter(Boolean);

    // Додаємо fallback-фото продукту
    const allImages = [
      ...offerImages,
      product?.thumbnail_url,
      ...(product?.attachments_data || []),
    ].filter(Boolean);

    // Унікальні фото
    return Array.from(new Set(allImages));
  }, [filteredOffers, product]);

  const currentImage = images[selectedImageIndex] || "/placeholder.svg"

  // Дії
  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: String(product.id),
      cartId: `${product.id}-${selectedColor ?? ""}-`,
      name: product.name,
      price: currentPrice,
      quantity: 1,
      image: selectedOffer?.thumbnail_url || selectedOffer?.image_url || product.thumbnail_url || product.attachments_data?.[0] || "/placeholder.svg",
      color: selectedColor ?? undefined,
      sku: currentSku,
    })
    showNotification(t("addToCart"))
  }

  const handleAddEngraving = () => {
    addItem({
      id: "35",
      cartId: "35-add_eng-", // or any unique identifier for engraving
      name: "Індивідуальне гравіювання",
      price: 170,
      quantity: 1,
      image: "https://diverso.api.keycrm.app/file-storage/thumbnails/diverso/uploads/2025-05-31/lblHWi6W73DO2MWxoLOytpzDLK6upwpf.jpeg",
      sku: "add_eng",
      hasEngraving: true,
    })
    setShowEngravingMessage(true)
    showNotification(t("addEngraving"))
  }

  // Галерея
  const handlePrevImage = () => setSelectedImageIndex(i => (i === 0 ? images.length - 1 : i - 1))
  const handleNextImage = () => setSelectedImageIndex(i => (i === images.length - 1 ? 0 : i + 1))

  // При кліку по кольору
  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    const offer = filteredOffers.find((offer: Offer) =>
      offer.properties?.some(
        (prop: OfferProperty) =>
          (prop.name.toLowerCase() === "color" || prop.name.toLowerCase() === "колір") &&
          prop.value.toLowerCase() === color.toLowerCase()
      )
    );
    if (offer) setSelectedOffer(offer);

    // Знаходимо індекс фото для цього offer у images
    const offerImage = offer?.thumbnail_url;
    const idx = images.findIndex(img => img === offerImage);
    setSelectedImageIndex(idx >= 0 ? idx : 0);
  };

  // --- тільки після всіх хуків ---
  if (!product) return <div>Product not found</div>;

  // Кольори з offers
  const availableColors: string[] = filteredOffers.length > 0
    ? Array.from(new Set(
        filteredOffers
          .map((offer: Offer) =>
            offer.properties?.find(
              (prop: OfferProperty) =>
                prop.name.toLowerCase() === "колір" || prop.name.toLowerCase() === "color"
            )?.value
          )
          .filter((v): v is string => typeof v === "string" && Boolean(v))
      ))
    : []

  // SKU та ціна
  const currentSku = selectedOffer?.sku || baseOffer?.sku || product.sku || "";
  const currentPrice = selectedOffer?.price ?? baseOffer?.price ?? product.price ?? 0

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Фото та галерея */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
            <Image src={currentImage} alt={product.name} fill className="object-cover" priority />
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button onClick={handlePrevImage} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Previous image">
              &lt;
            </button>
            <div className="flex space-x-2 mx-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${selectedImageIndex === idx ? "bg-primary scale-110" : "bg-gray-300 hover:bg-gray-400"}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
            <button onClick={handleNextImage} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Next image">
              &gt;
            </button>
          </div>
          {isGalleryOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
              <div className="flex justify-end p-4">
                <button onClick={() => setIsGalleryOpen(false)} className="text-white p-2 hover:bg-gray-800 rounded-full" aria-label="Close gallery">×</button>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <button onClick={handlePrevImage} className="absolute left-4 p-4 text-white hover:bg-gray-800 rounded-full" aria-label="Previous image">&lt;</button>
                <div className="relative h-[80vh] w-[80vw]">
                  <Image src={currentImage} alt={product.name} fill className="object-contain" priority />
                </div>
                <button onClick={handleNextImage} className="absolute right-4 p-4 text-white hover:bg-gray-800 rounded-full" aria-label="Next image">&gt;</button>
              </div>
              <div className="flex justify-center p-4 space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${selectedImageIndex === idx ? "bg-white scale-110" : "bg-gray-500 hover:bg-gray-400"}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Інформація та варіанти */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-xl font-bold mb-6">{currentPrice} ₴</div>
          <div className="text-sm text-muted-foreground mb-6">
            {t("sku")}: {currentSku}
          </div>
          <div className="prose prose-sm dark:prose-invert mb-6">
            <p>{product.description || t("productDescription")}</p>
          </div>
          {/* Кольори */}
          {filteredOffers.length > 0 && availableColors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">{t("color")}</h3>
              <div className="flex space-x-3">
                {availableColors.map((color, idx) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: colorOptions.find(option => option.color.toLowerCase() === color.toLowerCase())?.hex || "#ccc" }}
                    onClick={() => handleColorClick(color)}
                    aria-label={color}
                    title={color}
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
      <SimilarProducts currentProductId={id} />
    </>
  )
}
