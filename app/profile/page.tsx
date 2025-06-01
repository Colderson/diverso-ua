"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/components/language-provider"
import { userService } from "@/lib/supabase"
import { SmsNotification } from "@/components/sms-notification"
import { authService } from "@/lib/auth"

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState("novaposhta")
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  const [formData, setFormData] = useState({
    id: "",
    phone: "",
    name: "",
    surname: "",
    email: "",
    city: "",
    postOffice: "",
  })
  const [originalData, setOriginalData] = useState(formData)

  // Додаємо стан для віджета
  const [showWidget, setShowWidget] = useState(false)
  const [branch, setBranch] = useState("")
  const [city, setCity] = useState("")

  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      router.push("/")
      return
    }

    setIsLoggedIn(true)

    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsed = JSON.parse(userData)
      const initial = {
        id: parsed.id || "",
        phone: parsed.phone || "",
        name: parsed.name || "",
        surname: parsed.surname || "",
        email: parsed.email || "",
        city: "",
        postOffice: "",
      }
      setFormData(initial)
      setOriginalData(initial)
    }

    // Підтягуємо відділення Нової Пошти з localStorage
    const npBranch = localStorage.getItem("npBranch")
    if (npBranch) {
      try {
        const parsed = JSON.parse(npBranch)
        setBranch(parsed.branch || "")
        setCity(parsed.city || "")
      } catch {}
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function isValidPhone(phone: string) {
    return /^\+380\d{9}$/.test(phone)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.surname) {
      setNotification({ message: "Ім'я та прізвище обов'язкові", type: "error" })
      return
    }
    if (!isValidEmail(formData.email)) {
      setNotification({ message: "Невірний формат email", type: "error" })
      return
    }
    if (!isValidPhone(formData.phone)) {
      setNotification({ message: "Номер телефону має бути у форматі +380XXXXXXXXX", type: "error" })
      return
    }

    try {
      const { error } = await userService.updateUser({
        id: formData.id,
        phone: formData.phone,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
      })

      if (error) {
        setNotification({ message: "Помилка при оновленні даних у базі", type: "error" })
        return
      }

      localStorage.setItem("userData", JSON.stringify(formData))
      setOriginalData(formData)
      setNotification({ message: "Дані успішно збережено!", type: "success" })
    } catch (err) {
      console.error(err)
      setNotification({ message: "Сталася помилка при збереженні", type: "error" })
    }
  }

  // Nova Poshta widget listener
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://widget.novapost.com") return
      let cityName = ""
      if (event.data.settlementName) {
        cityName = event.data.settlementName
      } else if (event.data.settlement && event.data.settlement.name) {
        cityName = event.data.settlement.name
      }
      if (event.data && typeof event.data === "object" && event.data.name && cityName) {
        setBranch(event.data.name)
        setCity(cityName)
        setShowWidget(false)
        localStorage.setItem(
          "npBranch",
          JSON.stringify({
            branch: event.data.name,
            city: cityName,
            branchId: event.data.id?.toString() || "",
            branchExternalId: event.data.externalId || "",
          })
        )
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  function openFrame() {
    setShowWidget(true)
  }
  function closeFrame() {
    setShowWidget(false)
  }

  useEffect(() => {
    if (!formData.phone) return
    setOrdersLoading(true)
    setOrdersError(null)
    fetch(`/api/orders?phone=${encodeURIComponent(formData.phone)}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.data || [])
        setOrdersLoading(false)
      })
      .catch(() => {
        setOrdersError("Не вдалося завантажити історію замовлень")
        setOrdersLoading(false)
      })
  }, [formData.phone])

  if (!isLoggedIn) return null

  return (
    <>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("profile"), href: "/profile" }]} />
        <h1 className="text-3xl font-bold mb-6">{t("profile")}</h1>

        <Tabs defaultValue="personal">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="personal">{t("personalData")}</TabsTrigger>
            <TabsTrigger value="delivery">{t("deliverySettings")}</TabsTrigger>
            <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="bg-card p-6 rounded-lg space-y-4 shadow">
              <div>
                <Label>{t("phone")}</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <Label>{t("name")}</Label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label>{t("surname")}</Label>
                <Input name="surname" value={formData.surname} onChange={handleChange} />
              </div>
              <div>
                <Label>{t("email")}</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <Button className="w-full mt-2" onClick={handleSave}>
                {t("save")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="delivery">
            <div className="bg-card p-6 rounded-lg space-y-4 shadow">
              <div
                className="nova-poshta-button button-horizontal text-row"
                tabIndex={0}
                role="button"
                style={{ outline: "none" }}
                onClick={openFrame}
              >
                <span className="logo logo-no-margin" style={{ display: "flex", alignItems: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9401 16.4237H16.0596V21.271H19.2101L15.39 25.0911C14.6227 25.8585 13.3791 25.8585 12.6118 25.0911L8.79166 21.271H11.9401V16.4237ZM21.2688 19.2102V8.78972L25.091 12.6098C25.8583 13.3772 25.8583 14.6207 25.091 15.3881L21.2688 19.2102ZM16.0596 6.73099V11.5763H11.9401V6.73099H8.78958L12.6097 2.90882C13.377 2.14148 14.6206 2.14148 15.3879 2.90882L19.2101 6.73099H16.0596ZM2.90868 12.6098L6.72877 8.78972V19.2102L2.90868 15.3901C2.14133 14.6228 2.14133 13.3772 2.90868 12.6098Z" fill="#DA291C"/>
                  </svg>
                </span>
                <span className="wrapper">
                  <span className="text" style={{ fontWeight: 600 }}>
                    {branch ? branch : "Обрати відділення або поштомат"}
                  </span>
                  <span className="text-description">
                    {branch && city ? `${city}` : "Обрати відділення або поштомат"}
                  </span>
                </span>
                <span className="angle">
                  <svg width="16" height="16" fill="none"><path d="M6 12l4-4-4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
              {branch && (
                <p className="text-sm text-muted-foreground mt-1">
                  Обране відділення: <strong>{branch}</strong>
                </p>
              )}
            </div>
            {showWidget && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 1000,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                    position: "relative",
                    width: "90vw",
                    maxWidth: 820,
                    height: "80vh",
                    maxHeight: 600,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <button
                    onClick={closeFrame}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      fontSize: 20,
                      cursor: "pointer"
                    }}
                    aria-label="Закрити"
                  >
                    ×
                  </button>
                  <iframe
                    id="novaposhta-widget"
                    src="https://widget.novapost.com/division/index.html"
                    style={{
                      flex: 1,
                      border: 0,
                      borderRadius: 8,
                      width: "100%",
                      height: "100%"
                    }}
                    allow="geolocation"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-card p-6 rounded-lg shadow">
              {ordersLoading && <div>Завантаження...</div>}
              {ordersError && <div className="text-red-500">{ordersError}</div>}
              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="text-center text-muted-foreground">
                  <p>У вас ще немає замовлень.</p>
                </div>
              )}
              <div className="grid gap-6">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg bg-white shadow-sm p-4">
                    <div className="font-semibold mb-2 text-sm">
                      Замовлення №{order.id}
                    </div>
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-sm mb-2">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1">Назва</th>
                            <th className="text-left py-1 pl-2">Артикул</th>
                            <th className="text-right py-1 pl-2">Ціна</th>
                            <th className="text-right py-1 pl-2">Кількість</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products?.map((product: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; sku: any; offer: { sku: any }; price_sold: any; price: any; quantity: any }, idx: React.Key | null | undefined) => (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="py-1">{product.name}</td>
                              <td className="py-1 pl-2">{product.sku || product.offer?.sku || "—"}</td>
                              <td className="py-1 pl-2 text-right">{product.price_sold ?? product.price ?? "—"} грн</td>
                              <td className="py-1 pl-2 text-right">{product.quantity ?? 1}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>
                        {order.created_at?.slice(0, 10) || order.ordered_at?.slice(0, 10)}
                      </span>
                      <span className="font-bold text-base text-black">
                        Сума: {order.grand_total ??
                          order.products?.reduce(
                            (sum: number, p: { price_sold: any; price: any; quantity: any }) =>
                              sum +
                              ((Number(p.price_sold ?? p.price ?? 0)) *
                                (Number(p.quantity ?? 1))),
                            0
                          )
                        } грн
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          className="w-full mt-8"
          variant="outline"
          onClick={async () => {
            await authService.logout()
            localStorage.removeItem("isLoggedIn")
            localStorage.removeItem("userData")
            window.location.href = "/"
          }}
        >
          Вийти
        </Button>
      </div>

      {notification && (
        <SmsNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  )
}
