"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/components/language-provider"
import { SmsNotification } from "@/components/sms-notification"
import { LeaveConfirmationPopup } from "@/components/leave-confirmation-popup"

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState("novaposhta")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | (() => void) | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    city: "",
    postOffice: "",
  })
  const [originalData, setOriginalData] = useState({
    phone: "",
    name: "",
    email: "",
    city: "",
    postOffice: "",
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      router.push("/")
      return
    }

    setIsLoggedIn(true)

    // Get user data
    const userData = localStorage.getItem("userData")
    if (userData) {
      const { phone, name, email } = JSON.parse(userData)
      const initialData = {
        phone: phone || "",
        name: name || "",
        email: email || "",
        city: "",
        postOffice: "",
      }
      setFormData(initialData)
      setOriginalData(initialData)
    }
  }, [router])

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasUnsavedChanges(hasChanges)
  }, [formData, originalData])

  // Browser beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Intercept browser back/forward navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        // Push the current state back to prevent navigation
        window.history.pushState(null, "", window.location.href)
        setPendingNavigation(() => () => window.history.back())
        setShowLeaveConfirmation(true)
      }
    }

    // Push initial state
    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [hasUnsavedChanges])

  // Global navigation interceptor
  const interceptNavigation = useCallback(
    (href: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(href)
        setShowLeaveConfirmation(true)
        return false
      }
      return true
    },
    [hasUnsavedChanges],
  )

  // Set up global navigation interception
  useEffect(() => {
    // Store original router methods
    const originalPush = router.push
    const originalReplace = router.replace

    // Override router methods
    router.push = (href: string, options?: any) => {
      if (interceptNavigation(href)) {
        return originalPush.call(router, href, options)
      }
      return Promise.resolve(true)
    }

    router.replace = (href: string, options?: any) => {
      if (interceptNavigation(href)) {
        return originalReplace.call(router, href, options)
      }
      return Promise.resolve(true)
    }

    // Intercept all link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a[href]") as HTMLAnchorElement

      if (link && link.href && !link.href.startsWith("mailto:") && !link.href.startsWith("tel:")) {
        const url = new URL(link.href)
        const currentUrl = new URL(window.location.href)

        // Only intercept internal navigation
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          if (hasUnsavedChanges) {
            e.preventDefault()
            e.stopPropagation()
            setPendingNavigation(link.href)
            setShowLeaveConfirmation(true)
          }
        }
      }
    }

    document.addEventListener("click", handleLinkClick, true)

    return () => {
      // Restore original methods
      router.push = originalPush
      router.replace = originalReplace
      document.removeEventListener("click", handleLinkClick, true)
    }
  }, [router, interceptNavigation, hasUnsavedChanges])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Update user data in localStorage
    const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}")
    const updatedUserData = {
      ...currentUserData,
      ...formData,
    }
    localStorage.setItem("userData", JSON.stringify(updatedUserData))

    // Update original data to match saved data
    setOriginalData(formData)
    setHasUnsavedChanges(false)

    // Show success notification
    setNotification({
      message: "Дані успішно збережено!",
      type: "success",
    })
  }

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => performLogout)
      setShowLeaveConfirmation(true)
    } else {
      performLogout()
    }
  }

  const performLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userData")

    // Dispatch custom event to update header
    window.dispatchEvent(new Event("loginStateChanged"))

    router.push("/")
  }

  const handleLeaveConfirm = () => {
    setShowLeaveConfirmation(false)
    setHasUnsavedChanges(false) // Disable further warnings

    if (typeof pendingNavigation === "function") {
      pendingNavigation()
    } else if (typeof pendingNavigation === "string") {
      window.location.href = pendingNavigation
    }
    setPendingNavigation(null)
  }

  const handleLeaveCancel = () => {
    setShowLeaveConfirmation(false)
    setPendingNavigation(null)
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: t("home"), href: "/" },
            { label: t("profile"), href: "/profile" },
          ]}
        />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t("profile")}</h1>

          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">{t("personalData")}</TabsTrigger>
              <TabsTrigger value="delivery">{t("deliverySettings")}</TabsTrigger>
              <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">{t("personalData")}</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-phone">{t("phone")}</Label>
                    <Input id="account-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-name">{t("name")}</Label>
                    <Input id="account-name" name="name" value={formData.name} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-email">{t("email")}</Label>
                    <Input
                      id="account-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                  </div>

                  <Button onClick={handleSave} className="w-full">
                    {t("save")}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4 mt-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">{t("deliverySettings")}</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("contactMethod")}</Label>
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="novaposhta" id="novaposhta" />
                        <Label htmlFor="novaposhta">Нова Пошта (відділення/поштомат)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="address" id="address" />
                        <Label htmlFor="address">Адресна доставка</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {deliveryMethod === "novaposhta" && (
                    <>
                      <div className="space-y-2">
                        <Label>{t("city")}</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Виберіть місто" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kyiv">Київ</SelectItem>
                            <SelectItem value="lviv">Львів</SelectItem>
                            <SelectItem value="dnipro">Дніпро</SelectItem>
                            <SelectItem value="odesa">Одеса</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Відділення</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Виберіть відділення" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="branch1">Відділення №1</SelectItem>
                            <SelectItem value="branch2">Відділення №2</SelectItem>
                            <SelectItem value="branch3">Відділення №3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {deliveryMethod === "address" && (
                    <>
                      <div className="space-y-2">
                        <Label>{t("city")}</Label>
                        <Input placeholder="Введіть місто" />
                      </div>
                      <div className="space-y-2">
                        <Label>Вулиця</Label>
                        <Input placeholder="Введіть вулицю" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Будинок</Label>
                          <Input placeholder="№" />
                        </div>
                        <div className="space-y-2">
                          <Label>Квартира</Label>
                          <Input placeholder="№" />
                        </div>
                      </div>
                    </>
                  )}

                  <Button className="w-full">{t("save")}</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">{t("orderHistory")}</h2>
                <div className="text-center py-6 text-muted-foreground">
                  <p>{t("currentOrder")}</p>
                  <p className="mt-2">{t("orderHistoryEmpty")}</p>
                </div>
              </div>
            </TabsContent>

            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </div>
          </Tabs>
        </div>
      </div>

      {notification && (
        <SmsNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showLeaveConfirmation && (
        <LeaveConfirmationPopup
          title="Ви впевнені?"
          message="Незбережена інформація буде втрачена."
          confirmText="Так, покинути сторінку"
          cancelText="Ні, залишитися та зберегти"
          onConfirm={handleLeaveConfirm}
          onCancel={handleLeaveCancel}
          confirmVariant="outline"
          cancelVariant="destructive"
        />
      )}
    </>
  )
}
