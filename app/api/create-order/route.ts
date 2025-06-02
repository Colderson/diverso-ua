import { NextRequest, NextResponse } from "next/server"

const KEYCRM_API = "https://openapi.keycrm.app/v1"
const API_KEY = process.env.KEYCRM_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const { formData, items } = await req.json()
    console.log("formData", formData)
    console.log("items", items)

    // 1. Пошук покупця по телефону
    let buyerId: number | null = null
    const buyerFullName = `${formData.firstName} ${formData.lastName}`.trim()
    const buyerPhone = formData.phone

    // Визначаємо delivery_service_id залежно від типу оплати
    const deliveryServiceId = formData.paymentMethod === "prepaid" ? 3 : 1

    // Шукаємо покупця
    const buyersRes = await fetch(
      `${KEYCRM_API}/buyer?phone=${encodeURIComponent(buyerPhone)}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    )
    const buyersData = await buyersRes.json()
    if (buyersData.data && buyersData.data.length > 0) {
      buyerId = buyersData.data[0].id
    } else {
      // 2. Якщо не знайдено — створюємо нового покупця
      const createBuyerRes = await fetch(`${KEYCRM_API}/buyer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: buyerFullName,
          phone: [buyerPhone],
          shipping: [
            {
              city: formData.city,
              country: "Ukraine",
              recipient_full_name: buyerFullName,
              recipient_phone: buyerPhone,
              warehouse_ref: formData.branchExternalId,
              shipping_service: "Нова Пошта",
            },
          ],
        }),
      })
      const createBuyerData = await createBuyerRes.json()
      buyerId = createBuyerData.id
    }

    // 3. Формуємо коментарі
    const paymentComment = formData.paymentMethod === "prepaid" ? "ПЕРЕДОПЛАТА" : "НА ПОШТІ"
    const callComment = formData.doNotCall ? "НЕ ПЕРЕДЗВОНЮВАТИ" : "ПЕРЕДЗВОНИТИ"
    const managerComment = `${paymentComment}. ${callComment}.`

    // 4. Формуємо масив товарів
    const products = items.map((item: any) => ({
      sku: item.sku || "",
      price: item.price,
      quantity: item.quantity,
      name: item.name,
      properties: item.color
        ? [{ name: "Color", value: item.color }]
        : [],
      comment: item.hasEngraving ? "Гравіювання" : undefined,
      picture: item.image,
    }))

    // 5. Створюємо замовлення
    const orderRes = await fetch(`${KEYCRM_API}/order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        source_id: 4, // Diverso.ua
        buyer_id: buyerId,
        buyer: {
          full_name: buyerFullName,
          phone: buyerPhone,
          email: formData.email, // ДОДАЙ сюди email
        },
        manager_comment: managerComment,
        ordered_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        shipping: {
          shipping_service: "Нова Пошта",
          shipping_address_city: formData.city,
          shipping_receive_point: formData.branch,
          recipient_full_name: buyerFullName,
          recipient_phone: buyerPhone,
          warehouse_ref: formData.branchExternalId,
          delivery_service_id: deliveryServiceId,
        },
        products,
      }),
    })

    if (!orderRes.ok) {
      const error = await orderRes.text()
      console.error("KeyCRM order error:", error)
      return NextResponse.json({ error: "Помилка при створенні замовлення", details: error }, { status: 500 })
    }

    const orderData = await orderRes.json()
    return NextResponse.json({ success: true, order: orderData })
  } catch (error) {
    console.error("API create-order error:", error)
    return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 })
  }
}