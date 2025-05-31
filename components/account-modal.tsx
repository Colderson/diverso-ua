"use client"

import { useState, useEffect } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/components/language-provider"
import { PhoneInput } from "@/components/phone-input"
import { SmsNotification } from "@/components/sms-notification"
import { authService } from "@/lib/auth"
import { userService } from "@/lib/supabase"

type AccountModalProps = {
  onClose: () => void
  onLoginSuccess?: () => void
}

type FormMode = "initial" | "login" | "register" | "forgot-password" | "reset-password"

export function AccountModal({ onClose, onLoginSuccess }: AccountModalProps) {
  const { t } = useTranslation()
  const [formMode, setFormMode] = useState<FormMode>("initial")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [showResetCodeInput, setShowResetCodeInput] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    setIsVisible(true)
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCountdown])

  const isValidPhone = (phone: string) => {
    return phone.length >= 13 && phone.startsWith("+380")
  }

  const isValidPhoneDigits = (phone: string) => {
    const digits = phone.replace(/\D/g, "").slice(3)
    return digits.length === 9
  }

  const isValidName = (name: string) => {
    return /^[a-zA-Zа-яА-ЯіІїЇєЄ']+$/.test(name.trim())
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPassword = (password: string) => {
    return password.length >= 5
  }

  const handlePhoneSubmit = async () => {
    if (!isValidPhone(phone) || !isValidPhoneDigits(phone)) {
      setNotification({
        message: "Введіть правильний номер телефону",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const existingUser = await userService.checkUserByPhone(phone)

      if (existingUser) {
        setFormMode("login")
        setEmail(existingUser.email)
      } else {
        setFormMode("register")
      }
    } catch (error) {
      setNotification({
        message: "Помилка при перевірці користувача",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!password) {
      setNotification({
        message: "Введіть пароль",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.login(phone, password)

      if (result.success && result.user) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userData", JSON.stringify(result.user))
        window.dispatchEvent(new Event("loginStateChanged"))

        setNotification({
          message: result.message,
          type: "success",
        })

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess()
          }
          handleClose()
        }, 2000)
      } else {
        setNotification({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      setNotification({
        message: "Помилка входу в систему",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !confirmPassword) {
      setNotification({
        message: "Заповніть всі обов'язкові поля",
        type: "error",
      })
      return
    }

    if (!acceptPrivacy) {
      setNotification({
        message: "Підтвердіть згоду з політикою конфіденційності",
        type: "error",
      })
      return
    }

    if (password !== confirmPassword) {
      setNotification({
        message: "Паролі не співпадають",
        type: "error",
      })
      return
    }

    if (!isValidPassword(password)) {
      setNotification({
        message: "Пароль повинен містити мінімум 5 символів",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.register({
        email,
        phone,
        password,
        name,
        surname,
      })

      if (result.success && result.user) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userData", JSON.stringify(result.user))
        window.dispatchEvent(new Event("loginStateChanged"))

        setNotification({
          message: result.message,
          type: "success",
        })

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess()
          }
          handleClose()
        }, 2000)
      } else {
        setNotification({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      setNotification({
        message: "Помилка реєстрації",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail || !isValidEmail(resetEmail)) {
      setNotification({
        message: "Введіть правильну електронну пошту",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.initiatePasswordReset(resetEmail)

      setNotification({
        message: result.message,
        type: result.success ? "success" : "error",
      })

      if (result.success) {
        setShowResetCodeInput(true)
        setResendCountdown(60)
      }
    } catch (error) {
      setNotification({
        message: "Помилка при відновленні пароля",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendResetCode = async () => {
    if (!resetEmail) return

    setIsLoading(true)

    try {
      const result = await authService.initiatePasswordReset(resetEmail)

      setNotification({
        message: result.success ? "Код відправлено повторно" : result.message,
        type: result.success ? "info" : "error",
      })

      if (result.success) {
        setResendCountdown(60)
      }
    } catch (error) {
      setNotification({
        message: "Помилка при повторному відправленні",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyResetCode = async () => {
    if (!resetCode) {
      setNotification({
        message: "Введіть код відновлення",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.verifyResetCode(resetEmail, resetCode)

      if (result.success) {
        setCodeVerified(true)
        setFormMode("reset-password")
        setNotification({
          message: "Код підтверджено. Введіть новий пароль",
          type: "success",
        })
      } else {
        setNotification({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      setNotification({
        message: "Помилка при перевірці коду",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setNotification({
        message: "Заповніть всі поля",
        type: "error",
      })
      return
    }

    if (newPassword !== confirmNewPassword) {
      setNotification({
        message: "Паролі не співпадають",
        type: "error",
      })
      return
    }

    if (!isValidPassword(newPassword)) {
      setNotification({
        message: "Пароль повинен містити мінімум 5 символів",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.resetPassword(resetEmail, newPassword)

      if (result.success && result.user) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userData", JSON.stringify(result.user))
        window.dispatchEvent(new Event("loginStateChanged"))

        setNotification({
          message: result.message,
          type: "success",
        })

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess()
          }
          handleClose()
        }, 2000)
      } else {
        setNotification({
          message: result.message,
          type: "error",
        })
      }
    } catch (error) {
      setNotification({
        message: "Помилка при зміні пароля",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    document.body.style.overflow = "unset"
    setTimeout(onClose, 300)
  }

  const getTitle = () => {
    switch (formMode) {
      case "login":
        return "Увійти в акаунт"
      case "register":
        return "Реєстрація"
      case "forgot-password":
        return "Відновлення пароля"
      case "reset-password":
        return "Новий пароль"
      default:
        return "Увійти або зареєструватися"
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-background rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border relative transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-muted">
              <X className="h-5 w-5" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </div>

          <div className="p-6">
            {formMode === "initial" && (
              <div className="space-y-4">
                <p className="mb-6 text-muted-foreground text-sm">Введіть номер телефону для входу або реєстрації</p>

                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефону</Label>
                  <PhoneInput id="phone" value={phone} onChange={setPhone} placeholder="+38(012)-345-67-89" required />
                  {phone && !isValidPhoneDigits(phone) && (
                    <p className="text-red-500 text-sm">Номер повинен містити рівно 9 цифр</p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handlePhoneSubmit}
                  disabled={!isValidPhone(phone) || !isValidPhoneDigits(phone) || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Перевіряємо..." : "Продовжити"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Політика конфіденційності
                  </button>
                </div>
              </div>
            )}

            {formMode === "login" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-display">Номер телефону</Label>
                  <Input id="phone-display" value={phone} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введіть пароль"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="button" onClick={handleLogin} disabled={!password || isLoading} className="w-full">
                  {isLoading ? "Входимо..." : "Увійти"}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode("forgot-password")
                      setResetEmail(email)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Забули пароль?
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => setFormMode("initial")}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Змінити номер телефону
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Політика конфіденційності
                  </button>
                </div>
              </div>
            )}

            {formMode === "register" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-display">Номер телефону</Label>
                  <Input id="phone-display" value={phone} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Електронна пошта * (обов'язково для відновлення пароля)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  {email && !isValidEmail(email) && (
                    <p className="text-red-500 text-sm">Введіть правильну електронну пошту</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ім'я *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ім'я"
                      required
                    />
                    {name && !isValidName(name) && (
                      <p className="text-red-500 text-sm">Ім'я повинно містити тільки літери</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">Прізвище *</Label>
                    <Input
                      id="surname"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Прізвище"
                      required
                    />
                    {surname && !isValidName(surname) && (
                      <p className="text-red-500 text-sm">Прізвище повинно містити тільки літери</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Мінімум 5 символів"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {password && !isValidPassword(password) && (
                    <p className="text-red-500 text-sm">Пароль повинен містити мінімум 5 символів</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Підтвердження пароля *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторіть пароль"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-sm">Паролі не співпадають</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                  />
                  <label htmlFor="privacy" className="text-sm">
                    Я погоджуюсь з{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      політикою конфіденційності
                    </button>
                  </label>
                </div>

                <Button
                  type="button"
                  onClick={handleRegister}
                  disabled={
                    !name.trim() ||
                    !surname.trim() ||
                    !email.trim() ||
                    !password.trim() ||
                    !confirmPassword.trim() ||
                    !isValidName(name) ||
                    !isValidName(surname) ||
                    !isValidEmail(email) ||
                    !isValidPassword(password) ||
                    password !== confirmPassword ||
                    !acceptPrivacy ||
                    isLoading
                  }
                  className="w-full"
                >
                  {isLoading ? "Реєструємо..." : "Зареєструватися"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setFormMode("initial")}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Змінити номер телефону
                  </button>
                </div>
              </div>
            )}

            {formMode === "forgot-password" && (
              <div className="space-y-4">
                <p className="mb-6 text-muted-foreground text-sm">
                  Введіть електронну пошту, яку ви вказували при реєстрації
                </p>

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Електронна пошта</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={!resetEmail || !isValidEmail(resetEmail) || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Відправляємо..." : "Отримати код"}
                </Button>

                {showResetCodeInput && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reset-code">Код відновлення з email</Label>
                      <Input
                        id="reset-code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="Введіть код з email"
                        required
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleVerifyResetCode}
                      disabled={!resetCode || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Перевіряємо..." : "Підтвердити код"}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        onClick={handleResendResetCode}
                        disabled={resendCountdown > 0 || isLoading}
                        variant="ghost"
                        size="sm"
                        className={resendCountdown > 0 ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {resendCountdown > 0 ? `Відправити повторно (${resendCountdown}с)` : "Відправити код повторно"}
                      </Button>
                    </div>
                  </>
                )}

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setFormMode("login")}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Назад до входу
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Політика конфіденційності
                  </button>
                </div>
              </div>
            )}

            {formMode === "reset-password" && (
              <div className="space-y-4">
                <p className="mb-6 text-muted-foreground text-sm">Придумайте новий пароль для вашого акаунта</p>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Новий пароль</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Мінімум 5 символів"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {newPassword && !isValidPassword(newPassword) && (
                    <p className="text-red-500 text-sm">Пароль повинен містити мінімум 5 символів</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Підтвердження нового пароля</Label>
                  <div className="relative">
                    <Input
                      id="confirm-new-password"
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Повторіть новий пароль"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-red-500 text-sm">Паролі не співпадають</p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={
                    !newPassword ||
                    !confirmNewPassword ||
                    !isValidPassword(newPassword) ||
                    newPassword !== confirmNewPassword ||
                    isLoading
                  }
                  className="w-full"
                >
                  {isLoading ? "Змінюємо пароль..." : "Змінити пароль"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Політика конфіденційності
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {notification && (
        <SmsNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border relative">
            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Умови використання сайту</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPrivacyModal(false)}
                className="rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-sm max-w-none">
                <h3>1. Загальні положення</h3>
                <p>
                  1.1. Цей договір визначає умови використання Користувачами (Покупцями) матеріалів та сервісів сайту
                  www.diverso.ua (далі – сайт, інтернет-магазин, продавець).
                </p>
                <p>
                  1.2. Цей Договір публічної оферти є публічним, тобто відповідно до статті 633 Цивільного кодексу
                  України його умови однакові для всіх покупців незалежно від статусу (фізична особа, юридична особа,
                  фізична особа - підприємець). При повній згоді з даним Договором, Користувач (Покупець) приймає умови
                  і порядок оформлення замовлення, оплати товару, доставки товару і відповідальність за невиконання умов
                  даного договору.
                </p>
                <p>
                  1.3. Оферта (пропозиція на укладення цього договору) діє необмежено в часі з урахуванням умов, що
                  викладені в цій оферті, поки Адміністрація сайту не припинить її дію або замінить цю пропозицію новою
                  редакцією.
                </p>
                <p>
                  1.4. Адміністрація сайту має право у будь-який час в односторонньому порядку змінювати умови даного
                  Договору. Змінений договір вступає в силу з моменту його публікації на сайті. Користувач (Покупець) не
                  може пропонувати свої умови, а може лише приєднатися до запропонованої оферти.
                </p>
                <p>
                  1.5. У відповідності до Цивільного Кодексу України повним і безсуперечним прийняттям умов публічного
                  договору (акцепт), тобто публічної оферти сайту є факт оформлення замовлення натисканням на посилання
                  «Оформити замовлення» в кошику, а також у разі оплати замовлення в розмірі 100% на умовах цієї угоди.
                </p>
                <p>
                  1.6. Публічна оферта також є прийнятою (акцептованою Покупцем) при реєстрації Покупця на сайті
                  інтернет-магазину. Зареєструвавшись на сайті компанії Diverso, самостійно вибравши ЛОГІН та ПАРОЛЬ доступу
                  до інтернет-магазину (сайту), Покупець тим самим підтверджує, що він згоден з:
                </p>
                <ul>
                  <li>умовами цього публічного договору;</li>
                  <li>контактними даними та реквізитами Продавця;</li>
                  <li>
                    положеннями про обробку і захист персональних даних у базах персональних даних, власником яких є
                    Продавець;
                  </li>
                  <li>цінами та ціновою політикою Продавця;</li>
                  <li>умовами доставки товару;</li>
                  <li>гарантійними умовами та гарантійними зобов'язаннями Продавця.</li>
                </ul>

                <h3>2. Реєстрація на сайті</h3>
                <p>
                  2.1. Для оформлення замовлення та користуванням повним набором послуг, пропонованих компанією Diverso
                  Користувач (Покупець) може пройти процедуру реєстрації на сайті та внести в анкету необхідні дані.
                </p>
                <p>
                  2.2. При реєстрації на сайті Користувач (Покупець) зобов’язаний представити достовірну та точну 
                  інформацію про себе та свої контактні дані для виконання компанією своїх зобов’язань та доставки 
                  замовленого товару. Відповідальність за наслідки надання недостовірної інформації несе Користувач (Покупець)
                </p>

                <p>
                  2.3. В процесі реєстрації на сайті Користувач (Покупець) вказує логін та пароль, за безпеку яких він
                  несе відповідальність. За дії, виконані від його імені та за використанням його логіну та пароля несе
                  відповідальність виключно Користувач (Покупець).
                </p>

                <p>
                  2.4. Зареєструвавшись на сайті компанії ТОМ, самостійно вибравши ЛОГІН та ПАРОЛЬ доступу до
                  інтернет-магазину (сайту), Покупець тим самим підтверджує, що він згоден з:
                </p>
                <ul>
                  <li>умовами цього публічного договору;</li>
                  <li>контактними даними та реквізитами Продавця;</li>
                  <li>
                    положеннями про обробку і захист персональних даних у базах персональних даних, власником яких є
                    продавець;
                  </li>
                  <li>цінами та ціновою політикою Продавця;</li>
                  <li>умовами доставки товару;</li>
                  <li>гарантійними умовами та гарантійними зобов'язаннями Продавця</li>
                </ul>

                <h3>3. Конфіденційність та персональні дані</h3>
                <p>
                  3.1. Інформація, надана Користувачем (Покупцем) є конфіденційною. Адміністрація сайту використовує цю
                  інформацію з метою виконання замовлення Користувача (Покупця), якщо інші цілі не вказані в договорі.
                </p>

                <p>
                  3.2. Зареєструвавшись на сайті компанії Diverso, самостійно вибравши ЛОГІН та ПАРОЛЬ доступу до
                  інтернет-магазину (сайту), Користувач (Покупець) дає згоду на збір та обробку своїх персональних даних
                  з наступною метою: обробки та відправлення замовлення, отримання інформації про замовлення, відправка
                  телекомунікаційними засобами зв'язку (смс, електронна пошта, повідомлення у Вайбер, Телеграм чи
                  Інстаграм) рекламних та спеціальних пропозицій про акції, гівевеї, нові продукти та будь-якої іншої
                  інформації про маркетингову діяльність компанії Diverso.
                </p>

                <p>
                  3.3. З метою, передбаченою цим пунктом, компанія Diverso має право надсилати електронні листи,
                  смс-повідомлення та телефонувати на номер телефону, вказаний при оформленні замовлення чи реєстрації
                  на сайті.
                </p>

                <p>
                  3.4. Користувач (Покупець) дає згоду на використання технології cookie. Файли cookie не містять
                  особистої інформації та не можуть жодним чином зчитувати інформацію із жорсткого диска Користувача
                  (Покупця). Файли cookie використовуються для підвищення якості сервісу: швидкої ідентифікації
                  Користувача (Покупця), збереження налаштувань, особистих преференцій тощо. При відключенні технології
                  cookie Користувачем, адміністрація не гарантує функціонування всіх сервісів сайту.
                </p>

                <p>
                  3.5. Користувач (Покупець) надає Адміністрації сайту дозвіл здійснювати обробку його персональних
                  даних, в т.ч.: поміщати його персональні дані у базу даних та зберігати, оновлювати чи змінювати їх
                  (без додаткового повідомлення). Адміністрація зобов'язується забезпечити захист даних від
                  несанкціонованого доступу третіх осіб та не передавати дані окрім випадків, коли це необхідно для
                  безпосередньої обробки цих даних та на обов'язковий запит компетентних державних органів.
                </p>

                <p>
                  3.6. У випадку, якщо Користувач (Покупець) не бажає отримувати повідомлення про рекламні акції та нову
                  продукцію компанії, він може відмовитись від неї, сповістивши про це Адміністрацію.
                </p>

                <h3>4. Порядок оформлення замовлення</h3>
                <p>
                  4.1. Покупець самостійно оформлює замовлення в інтернет-магазині. За порядок оформлення замовлення та
                  вибір товару несе відповідальність Покупець. Потім з покупцем зв'зується менеджер для обговорення деталей замовлення та оплати.
                  При оформленні замовлення через Фейсбук, Інстаграм, Телеграм чи по телефону, повідомлення здійснюється за
                  допомогою відповідного каналу зв'язку.
                </p>

                <h3>5. Обмеження відповідальності Адміністрації</h3>
                <p>
                  5.1. Адміністрація не несе відповідальності за можливі неточності та опечатки в матеріалах на сайті.
                  Адміністрація докладає всіх зусиль для забезпечення точності інформації. Всі матеріали представлені на
                  умовах «як є».
                </p>

                <p>
                  5.2. Адміністрація не несе відповідальності за шкоду, збитки чи витрати, спричинені використанням чи
                  неможливістю використання сайту.
                </p>

                <p>5.3. Адміністрація сайту не несе відповідальності за:</p>
                <p>
                  5.3.1. Затримки чи збої в процесі здійснення операції, що виникли внаслідок неполадок у
                  телекомунікаційних, комп'ютерних чи електричних системах.
                </p>
                <p>5.3.2. Дії систем переводу, банків, платіжних систем та за затримки, пов'язані із їх роботою.</p>
                <p>
                  5.3.3. Належне функціонування сайту, якщо Користувач не має належних технічних засобів для його
                  використання.
                </p>

                <h3>6. Виключні права</h3>
                <p>
                  6.1. Всі об'єкти, доступні за допомогою сервісів сайту, в т.ч. елементи дизайну, текст, графічні
                  зображення, відео, бази даних та інші об'єкти чи контент, розміщений на сайті є об'єктом виключних
                  прав Адміністрації та інших Правовласників.
                </p>

                <p>
                  6.2. Використання Користувачем елементів змісту сервісів чи контенту для особистого некомерційного
                  користування допускається при умові збереження інформації про авторство, збереження імені/назви
                  Правовласника та відповідного об'єкту без змін.
                </p>

                <p>
                  6.3. З усіх питань відносно прав, а також з іншими питаннями чи пропозиціями стосовно цього Договору,
                  ви можете зв'язатись із нами написавши на адресу info@maslotom.com.
                </p>

                <h3>7. Обмін та повернення товарів</h3>

                <p>
                  7.2. При отриманні перевірте (оригінальну) упаковку на цілісність та упевніться, що товар відповідає
                  вашому замовленню. Якщо (оригінальна) упаковка пошкоджена, ми відправимо аналогічний товар та оплатимо
                  доставку або повернемо вартість замовлення – на ваш вибір. Товар не підлягає обміну чи поверненню
                  після пошкодження вами упаковки чи факту його використання.
                </p>

                <p>
                  7.3. Для оформлення запиту про обмін/повернення коштів, відправте нам, будь ласка, будь яким зручним
                  для вас способом (Інстаграм, Вайбер, Телеграм, електронна пошта) наступні документи:
                </p>
                <ul>
                  <li>фото отриманого товару, на якому чітко видно пошкодження;</li>
                  <li>акт приймання-передачі оформлений на відділенні НП в момент отримання відправлення.</li>
                </ul>

                <p>7.4. Термін оформлення запиту – одна доба з часу отримання товару.</p>

                <p>
                  7.5. Термін обробки запиту та повернення коштів – два робочих дні (без врахування часу, необхідного
                  банку-посереднику для переказу коштів).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
