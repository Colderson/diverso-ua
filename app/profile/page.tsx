"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function isValidEmail(email: string) {
    // Проста перевірка формату email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function isValidPhone(phone: string) {
    // Перевірка на формат +380XXXXXXXXX (де X — цифра)
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
              <Label>{t("contactMethod")}</Label>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="novaposhta" id="novaposhta" />
                  <Label htmlFor="novaposhta">Нова Пошта</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="address" id="address" />
                  <Label htmlFor="address">Адресна доставка</Label>
                </div>
              </RadioGroup>

              {deliveryMethod === "novaposhta" && (
                <>
                  <Label>Місто</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Виберіть місто" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kyiv">Київ</SelectItem>
                      <SelectItem value="lviv">Львів</SelectItem>
                      <SelectItem value="odesa">Одеса</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Відділення</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Виберіть відділення" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Відділення №1</SelectItem>
                      <SelectItem value="2">Відділення №2</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-card p-6 rounded-lg shadow text-center text-muted-foreground">
              <p>{t("orderHistoryEmpty")}</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Кнопка Вийти */}
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
