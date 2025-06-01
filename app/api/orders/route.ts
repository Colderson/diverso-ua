import { NextRequest, NextResponse } from "next/server"

const KEYCRM_API = "https://openapi.keycrm.app/v1"
const API_KEY = process.env.KEYCRM_API_KEY || "ZjM5NjliMDA2ODZjYjAzM2JkOTNiZjQyZDg2NTg1ZmE4MjBkZDZlYQ"

function normalizePhone(phone: string) {
  return (phone || "").replace(/\D/g, "")
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone")
  if (!phone) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 })
  }

  try {
    // 1. Шукаємо покупця по телефону
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

    // 2. Шукаємо замовлення по buyer_id і одразу підтягуємо товари та оффери
    const orderRes = await fetch(
      `${KEYCRM_API}/order?buyer_id=${buyerId}&include=buyer,shipping,products.offer`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    )
    const orderData = await orderRes.json()

    // 3. Фільтруємо замовлення по номеру телефону (buyer.phone або shipping.recipient_phone)
    const filteredOrders = (orderData.data || []).filter((order: any) => {
      const buyerPhone = normalizePhone(order.buyer?.phone)
      const shippingPhone = normalizePhone(order.shipping?.recipient_phone)
      const searchPhone = normalizePhone(phone)
      return buyerPhone === searchPhone || shippingPhone === searchPhone
    })

    // 4. Повертаємо замовлення з товарами (products вже є!)
    return NextResponse.json({ ...orderData, data: filteredOrders })
  } catch (error) {
    return NextResponse.json({ error: "CRM fetch error" }, { status: 500 })
  }
}