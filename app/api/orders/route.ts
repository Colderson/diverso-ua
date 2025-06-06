import { NextRequest, NextResponse } from "next/server"

const KEYCRM_API = "https://openapi.keycrm.app/v1"
const API_KEY = process.env.KEYCRM_API_KEY
if (!API_KEY) throw new Error("KEYCRM_API_KEY is not defined")

function normalizePhone(phone: string) {
  return (phone || "").replace(/\D/g, "")
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone")
  if (!phone) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 })
  }

  try {
    // 1. Отримати покупця за телефоном
    const buyerRes = await fetch(`${KEYCRM_API}/buyer?phone=${encodeURIComponent(phone)}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const buyerData = await buyerRes.json()
    if (!buyerData.data || !Array.isArray(buyerData.data) || buyerData.data.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const buyerId = buyerData.data[0].id

    // 2. Отримати замовлення по buyer_id, з включенням shipping, tracking та статусу доставки
    const orderRes = await fetch(
      `${KEYCRM_API}/order?buyer_id=${buyerId}&include=buyer,shipping,shipping.lastHistory,products.offer,status`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    )

    const orderData = await orderRes.json()

    // 3. Фільтрувати замовлення по номеру телефону покупця або отримувача
    const filteredOrders = (orderData.data || []).filter((order: any) => {
      const buyerPhone = normalizePhone(order.buyer?.phone)
      const shippingPhone = normalizePhone(order.shipping?.recipient_phone)
      const searchPhone = normalizePhone(phone)
      return buyerPhone === searchPhone || shippingPhone === searchPhone
    })

    // 4. Повернути дані
    return NextResponse.json({ ...orderData, data: filteredOrders })
  } catch (error) {
    console.error("CRM fetch error:", error)
    return NextResponse.json({ error: "CRM fetch error" }, { status: 500 })
  }
}
