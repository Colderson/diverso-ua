"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { AccountForm } from "@/components/account-form"
import { OrderHistory } from "@/components/order-history"

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Головна", href: "/" },
          { label: "Особистий кабінет", href: "/account" },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Особистий кабінет</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <AccountForm />
          <OrderHistory />
        </div>
      </div>
    </div>
  )
}
