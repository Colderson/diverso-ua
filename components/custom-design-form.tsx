"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslation } from "@/components/language-provider"
import { ConfirmationPopup } from "@/components/confirmation-popup"

export function CustomDesignForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [contactMethod, setContactMethod] = useState("telegram")
  const [username, setUsername] = useState("")
  const [designDescription, setDesignDescription] = useState("")
  const [comments, setComments] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TO DO: Send form data to email diverso.ua.2024@gmail.com
    console.log({
      name,
      phone,
      contactMethod,
      username,
      designDescription,
      comments,
      file,
    })

    // Reset form
    setName("")
    setPhone("")
    setContactMethod("telegram")
    setUsername("")
    setDesignDescription("")
    setComments("")
    setFile(null)

    // Show confirmation popup
    setShowConfirmation(true)
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/")
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phoneNumber")}</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("contactMethod")}</Label>
          <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="telegram" id="telegram" />
              <Label htmlFor="telegram">Telegram</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="viber" id="viber" />
              <Label htmlFor="viber">Viber</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="instagram" id="instagram" />
              <Label htmlFor="instagram">Instagram</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("usernamePlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="design-description">{t("designDescription")}</Label>
          <Textarea
            id="design-description"
            value={designDescription}
            onChange={(e) => setDesignDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">{t("uploadImage")}</Label>
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <Input
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0])
                }
              }}
            />
            <Label htmlFor="image" className="cursor-pointer flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">{file ? file.name : t("uploadImageText")}</span>
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comments">{t("additionalComments")}</Label>
          <Textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
        </div>

        <Button type="submit" className="w-full">
          {t("sendRequest")}
        </Button>
      </form>

      {showConfirmation && <ConfirmationPopup message={t("requestSuccess")} onClose={handleConfirmationClose} />}
    </>
  )
}
