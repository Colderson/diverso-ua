import { NextRequest, NextResponse } from "next/server"

const KEYCRM_API = "https://openapi.keycrm.app/v1"
const API_KEY = process.env.KEYCRM_API_KEY
if (!API_KEY) throw new Error("KEYCRM_API_KEY is not defined")
const CANCELLED_STATUS_ID = 20

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id

  // 1. Отримуємо замовлення з CRM (можна залишити для перевірки існування)
  const orderRes = await fetch(`${KEYCRM_API}/order/${orderId}?include=status`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })
  if (!orderRes.ok) {
    return NextResponse.json({ error: "Замовлення не знайдено" }, { status: 404 })
  }

  // 2. Ставимо статус "Скасовано" незалежно від поточного статусу
  const cancelRes = await fetch(`${KEYCRM_API}/order/${orderId}`, {
    method: "PUT", 
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status_id: CANCELLED_STATUS_ID }),
  })

  if (!cancelRes.ok) {
    const errorText = await cancelRes.text();
    console.log("CRM error:", errorText);
    return NextResponse.json({ error: "Не вдалося скасувати замовлення", details: errorText }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}