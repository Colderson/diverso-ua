"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tokenError, setTokenError] = useState(false)

  // Отримати access_token та refresh_token з хешу URL
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")

    if (!access_token || !refresh_token) {
      setTokenError(true)
      setMessage("Відсутній access_token або refresh_token")
      setLoading(false)
      return
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setTokenError(true)
          setMessage("Невалідний або прострочений токен")
        }
        setLoading(false)
      })
  }, [])

  const isValidPassword = (p: string) => p.length >= 6
  const canSubmit =
    isValidPassword(newPassword) &&
    newPassword === confirmPassword &&
    !isSubmitting &&
    !tokenError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!isValidPassword(newPassword)) {
      setMessage("Пароль має бути щонайменше 6 символів")
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage("Паролі не збігаються")
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setIsSubmitting(false)

    if (error) {
      setMessage("Помилка при оновленні пароля: " + error.message)
    } else {
      setMessage("Пароль успішно оновлено. Перенаправлення...")
      setTimeout(() => router.push("/"), 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-xl font-bold mb-4">Скидання пароля</h2>

      {loading ? (
        <p>Завантаження...</p>
      ) : tokenError ? (
        <p className="text-red-600">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Новий пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />
            {newPassword && newPassword.length < 6 && (
              <p className="text-sm text-red-600">
                Пароль має бути щонайменше 6 символів
              </p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Підтвердіть новий пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600">Паролі не збігаються</p>
            )}
          </div>
          <Button type="submit" disabled={!canSubmit} className="w-full">
            Оновити пароль
          </Button>
        </form>
      )}

      {message && !loading && (
        <div
          className={`mt-4 text-center text-base font-medium ${
            message.includes("успішно") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
