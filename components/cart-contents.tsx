"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"

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
	{ name: "Золотий", color: "gold", hex: "#FFD700" },
	{ name: "Золотий", color: "gol", hex: "#FFD700" },
];
const getColorHex = (color: string | undefined) =>
	colorOptions.find(opt => opt.color.toLowerCase() === (color ?? "").toLowerCase())?.hex || "#ccc";

export function CartContents() {
	const { items, removeItem, updateQuantity, itemCount, totalPrice } = useCart()
	const { t } = useTranslation()

	const hasEngravingItems = items.some((item) => item.hasEngraving)

	if (itemCount === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-2xl font-bold mb-2">{t("emptyCart")}</h2>
				<p className="text-muted-foreground mb-6">{t("goToCatalogDescription")}</p>
				<Link href="/catalog">
					<Button>{t("goToCatalog")}</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className="grid lg:grid-cols-3 gap-8">
			{/* Left side - Cart items */}
			<div className="lg:col-span-2">
				<div className="space-y-4">
					{items.map(item => (
						<Card key={`${item.cartId}-${item.sku || ""}`}>
							<CardContent className="p-4">
								<div className="flex items-center space-x-4">
									<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
										<Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
									</div>

									<div className="flex-grow">
										<h3 className="font-medium">{item.name}</h3>
										<p className="text-muted-foreground">{item.price} ₴</p>
										{item.sku && (
											<div className="text-xs text-muted-foreground mt-1">
												Артикул: {item.sku}
											</div>
										)}
										{item.color && (
											<div className="flex items-center mt-1">
												<span className="text-sm text-muted-foreground mr-2">{t("color")}:</span>
												<span
													className="w-4 h-4 rounded-full border"
													style={{ backgroundColor: getColorHex(item.color) }}
												></span>
											</div>
										)}
										{item.hasEngraving && <div className="text-sm text-primary mt-1">+ Гравіювання</div>}
									</div>

									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
										>
											<Minus className="h-4 w-4" />
										</Button>

										<span className="w-8 text-center">{item.quantity}</span>

										<Button
											variant="outline"
											size="icon"
											onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>

									<div className="text-right w-24">
										<p className="font-bold">{item.price * item.quantity} ₴</p>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeItem(item.cartId)}
										className="text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}

					{hasEngravingItems && (
						<Card className="mt-6">
							<CardContent className="p-4">
								<p className="text-sm">{t("engravingNote")}</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Right side - Order summary */}
			<div className="lg:col-span-1">
				<Card className="sticky top-24">
					<CardContent className="p-6">
						<h3 className="text-lg font-bold mb-4">{t("total")}</h3>

						<div className="space-y-2 mb-4">
							<div className="flex justify-between">
								<span>
									{t("items")} ({itemCount})
								</span>
								<span>{totalPrice} ₴</span>
							</div>
							<div className="flex justify-between">
								<span>{t("delivery")}</span>
								<span>{t("novaPoshtaRates")}</span>
							</div>
						</div>

						<div className="border-t pt-4 mb-6">
							<div className="flex justify-between font-bold text-lg">
								<span>{t("toPay")}</span>
								<span>{totalPrice} ₴</span>
							</div>
						</div>

						<Link href="/checkout">
							<Button className="w-full">{t("placeOrder")}</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
