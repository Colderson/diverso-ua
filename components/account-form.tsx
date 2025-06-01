"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    postOffice: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the user profile
    console.log("Profile data:", formData)
    alert("Профіль успішно оновлено!")
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Особисті дані</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">ПІБ</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (для розсилок)</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Місто</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postOffice">Відділення Нової Пошти</Label>
          <Input id="postOffice" name="postOffice" value={formData.postOffice} onChange={handleChange} />
        </div>

        <Button type="submit">Зберегти зміни</Button>
      </form>
    </div>
  )
}
