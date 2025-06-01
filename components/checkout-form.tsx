"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/components/language-provider"
import { ConfirmationPopup } from "@/components/confirmation-popup"
import { PhoneInput } from "@/components/phone-input"
import { SmsNotification } from "@/components/sms-notification"

export function CheckoutForm() {
  const router = useRouter()
  const { clearCart } = useCart()
  const { t } = useTranslation()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [smsNotification, setSmsNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  const [formData, setFormData] = useState({
    phone: "",
    smsCode: "",
    paymentMethod: "cod",
    firstName: "",
    lastName: "",
    city: "",
    branch: "",
    doNotCall: false,
  })

  const [showSmsInput, setShowSmsInput] = useState(false)
  const [smsCodeSent, setSmsCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)

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

  const handleGetSmsCode = () => {
    if (!isValidPhone(formData.phone)) {
      setSmsNotification({
        message: t("invalidPhone"),
        type: "error",
      })
      return
    }

    // TO DO: Implement SMS code sending via backend API
    console.log("Sending SMS to:", formData.phone)
    setShowSmsInput(true)
    setSmsCodeSent(true)

    // Show success notification
    setSmsNotification({
      message: t("smsSent"),
      type: "info",
    })
  }

  const handleVerifyCode = () => {
    if (!formData.smsCode) {
      setSmsNotification({
        message: t("enterSmsCodePrompt"),
        type: "error",
      })
      return
    }

    // TO DO: Implement SMS code verification via backend API
    console.log("Verifying code:", formData.smsCode)

    if (formData.smsCode === "1111") {
      // Correct code
      setCodeVerified(true)
      setSmsNotification({
        message: t("smsCodeVerified"),
        type: "success",
      })
    } else if (formData.smsCode === "2222") {
      // Incorrect code
      setSmsNotification({
        message: t("smsCodeIncorrect"),
        type: "error",
      })
    } else {
      // For any other code, treat as incorrect for testing
      setSmsNotification({
        message: t("smsCodeIncorrect"),
        type: "error",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TO DO: Send order data to CRM system
    console.log("Order data:", formData)

    // Show confirmation popup
    setShowConfirmation(true)

    // Clear cart
    clearCart()
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/")
  }

  function openFrame() {
    const apiKey = "3e9f2e92be7ce375da5f0bf97d48989a"
    const url = `https://developers.novaposhta.ua/?apiKey=${apiKey}`

    const widgetWindow = window.open(
      url,
      "novaPoshtaWidget",
      "width=820,height=600"
    )

    // Додаємо слухача для отримання вибраного відділення
    window.addEventListener("message", (event) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data)
          if (data && data.data && data.data.WarehouseDescription) {
            const branchName = data.data.WarehouseDescription
            setFormData((prev) => ({
              ...prev,
              branch: branchName,
            }))
          }
        } catch (e) {
          // Некоректна відповідь від віджета
        }
      }
    })
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
                <div className="flex space-x-2">
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                    placeholder="+38(012)-345-67-89"
                    className="flex-1"
                    required
                  />
                  <Button type="button" onClick={handleGetSmsCode} disabled={!isValidPhone(formData.phone)}>
                    {t("getSmsCode")}
                  </Button>
                </div>
              </div>

              {showSmsInput && (
                <div className="space-y-2">
                  <Label htmlFor="smsCode">{t("smsCode")}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="smsCode"
                      name="smsCode"
                      value={formData.smsCode}
                      onChange={handleChange}
                      placeholder={t("enterSmsCode")}
                      required
                      className="flex-1"
                      disabled={codeVerified}
                    />
                    <Button type="button" onClick={handleVerifyCode} disabled={codeVerified}>
                      {t("verifyCode")}
                    </Button>
                  </div>
                  {codeVerified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("smsCodeVerified")}
                    </div>
                  )}
                </div>
              )}
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

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => openFrame()}
                  className="w-full"
                >
                  {formData.branch ? formData.branch : "Вибрати відділення"}
                </Button>
                {formData.branch && (
                  <p className="text-sm text-muted-foreground">
                    Обране відділення: <strong>{formData.branch}</strong>
                  </p>
                )}
              </div>

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
    </>
  )
}
