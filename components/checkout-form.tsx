"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"
import { ConfirmationPopup } from "@/components/confirmation-popup"
import { PhoneInput } from "@/components/phone-input"
import { SmsNotification } from "@/components/sms-notification"

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart } = useCart() // <-- отримуємо товари з кошика
  const { t } = useTranslation()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [smsNotification, setSmsNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  const [formData, setFormData] = useState({
    phone: "",
    paymentMethod: "cod",
    firstName: "",
    lastName: "",
    city: "",
    branch: "",
    branchAddress: "",
    branchId: "",
    branchExternalId: "",
    doNotCall: false,
  })

  const [showWidget, setShowWidget] = useState(false)

  const isValidPhone = (phone: string) => {
    return phone.length >= 13 && phone.startsWith("+380")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Додаємо async функцію для оформлення замовлення
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, items }),
      })
      if (!res.ok) {
        const data = await res.json()
        setSmsNotification({ message: data.error || "Помилка при створенні замовлення", type: "error" })
        return
      }
      setShowConfirmation(true)
      clearCart()
    } catch (err) {
      setSmsNotification({ message: "Помилка при створенні замовлення", type: "error" })
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/")
  }

  // Слухач для Nova Poshta widget
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://widget.novapost.com") return;
      let city = "";
      if (event.data.settlementName) {
        city = event.data.settlementName;
      } else if (event.data.settlement && event.data.settlement.name) {
        city = event.data.settlement.name;
      }
      if (event.data && typeof event.data === "object" && event.data.name && city) {
        setFormData((prev) => ({
          ...prev,
          branch: event.data.name,
          city: city,
          branchId: event.data.id?.toString() || "",
          branchExternalId: event.data.externalId || "",
        }));
        setShowWidget(false);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [])

  function openFrame() {
    setShowWidget(true);
  }

  function closeFrame() {
    setShowWidget(false);
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Phone Number */}
          <Card>
            <CardHeader>
              <CardTitle>1. {t("phoneNumber")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phoneNumber")}</Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                  placeholder="+38(012)-345-67-89"
                  className="flex-1"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>2. {t("paymentMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">{t("cashOnDelivery")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prepaid" id="prepaid" />
                  <Label htmlFor="prepaid">{t("prepayment")}</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Step 3: Shipping Details */}
          <Card>
            <CardHeader>
              <CardTitle>3. {t("shippingDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              {/* Nova Poshta Widget Button */}
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
                    {formData.branch
                      ? formData.branch
                      : "Обрати відділення або поштомат"}
                  </span>
                  <span className="text-description">
                    {formData.branch && formData.city
                      ? `${formData.city}`
                      : "Обрати відділення або поштомат"}
                  </span>
                </span>
                <span className="angle">
                  <svg width="16" height="16" fill="none"><path d="M6 12l4-4-4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
              {/* End Nova Poshta Widget Button */}

              {formData.branch && (
                <p className="text-sm text-muted-foreground mt-1">
                  Обране відділення: <strong>{formData.branch}</strong>
                </p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="doNotCall"
                  checked={formData.doNotCall}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, doNotCall: checked as boolean }))}
                />
                <Label htmlFor="doNotCall">{t("doNotCall")}</Label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            {t("placeOrder")}
          </Button>
        </form>
      </div>

      {showConfirmation && (
        <ConfirmationPopup
          message={t("orderSuccess")}
          additionalMessage={!formData.doNotCall ? t("managerContact") : undefined}
          onClose={handleConfirmationClose}
        />
      )}

      {smsNotification && (
        <SmsNotification
          message={smsNotification.message}
          type={smsNotification.type}
          onClose={() => setSmsNotification(null)}
        />
      )}

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
    </>
  )
}
