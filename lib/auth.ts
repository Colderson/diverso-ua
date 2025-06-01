import { supabase, userService, passwordUtils } from "./supabase"

export interface AuthResult {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    phone: string
    name: string
  }
}

export const authService = {
  // Вхід користувача
  async login(phone: string, password: string): Promise<AuthResult> {
    try {
      const user = await userService.checkUserByPhone(phone)

      if (!user) {
        return {
          success: false,
          message: "Користувача не знайдено",
        }
      }

      const isPasswordValid = await passwordUtils.verifyPassword(password, user.password_hash)

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Хибний пароль",
        }
      }

      return {
        success: true,
        message: "Успішний вхід",
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: `${user.name} ${user.surname}`,
        },
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "Помилка входу в систему",
      }
    }
  },

  // Реєстрація користувача
  async register(userData: {
    email: string
    phone: string
    password: string
    name: string
    surname: string
  }): Promise<AuthResult> {
    try {
      console.log("Starting registration for:", userData.email)

      // Перевірка чи існує користувач
      const existingUserByPhone = await userService.checkUserByPhone(userData.phone)
      const existingUserByEmail = await userService.checkUserByEmail(userData.email)

      if (existingUserByPhone) {
        return {
          success: false,
          message: "Користувач з таким номером телефону вже існує",
        }
      }

      if (existingUserByEmail) {
        return {
          success: false,
          message: "Користувач з такою електронною поштою вже існує",
        }
      }

      // Хешування пароля
      const passwordHash = await passwordUtils.hashPassword(userData.password)
      console.log("Password hashed successfully")

      // Створення користувача
      const newUser = await userService.createUser({
        email: userData.email,
        phone: userData.phone,
        password_hash: passwordHash,
        name: userData.name,
        surname: userData.surname,
      })

      if (!newUser) {
        return {
          success: false,
          message: "Помилка при створенні користувача",
        }
      }

      console.log("User registered successfully:", newUser.id)

      return {
        success: true,
        message: "Успішна реєстрація",
        user: {
          id: newUser.id,
          email: newUser.email,
          phone: newUser.phone,
          name: `${newUser.name} ${newUser.surname}`,
        },
      }
    } catch (error) {
      console.error("Registration error:", error)

      // Детальна обробка помилок Supabase
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "23505") {
          return {
            success: false,
            message: "Користувач з такими даними вже існує",
          }
        }
      }

      return {
        success: false,
        message: "Помилка реєстрації. Спробуйте ще раз",
      }
    }
  },

  // Ініціація скидання пароля через Supabase Auth
  async initiatePasswordReset(email: string): Promise<AuthResult> {
    try {
      // Перевірка чи існує користувач в нашій таблиці
      const user = await userService.checkUserByEmail(email)

      if (!user) {
        return {
          success: false,
          message: "Користувача з такою поштою не знайдено",
        }
      }

      // Відправка email через Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Supabase reset password error:", error)
        return {
          success: false,
          message: "Помилка при відправці email",
        }
      }

      return {
        success: true,
        message: "Код для відновлення пароля відправлено на вашу пошту",
      }
    } catch (error) {
      console.error("Password reset initiation error:", error)
      return {
        success: false,
        message: "Помилка при ініціації скидання пароля",
      }
    }
  },

  // Підтвердження коду відновлення (спрощений підхід для демо)
  async verifyResetCode(email: string, token: string): Promise<AuthResult> {
    try {
      // Для демо-версії приймаємо будь-який 6-значний код
      // В продакшені тут має бути реальна перевірка через Supabase
      if (token.length === 6 && /^\d{6}$/.test(token)) {
        // Перевіряємо чи існує користувач
        const user = await userService.checkUserByEmail(email)

        if (!user) {
          return {
            success: false,
            message: "Користувача не знайдено",
          }
        }

        return {
          success: true,
          message: "Код підтверджено",
        }
      }

      return {
        success: false,
        message: "Невірний код відновлення",
      }
    } catch (error) {
      console.error("Reset code verification error:", error)
      return {
        success: false,
        message: "Помилка при перевірці коду",
      }
    }
  },

  // Скидання пароля після підтвердження коду
  async resetPassword(email: string, newPassword: string): Promise<AuthResult> {
    try {
      // Хешування нового пароля
      const newPasswordHash = await passwordUtils.hashPassword(newPassword)

      // Оновлення пароля в нашій таблиці
      const updateSuccess = await userService.updatePassword(email, newPasswordHash)

      if (!updateSuccess) {
        return {
          success: false,
          message: "Помилка при оновленні пароля",
        }
      }

      // Отримання даних користувача для автоматичного входу
      const user = await userService.checkUserByEmail(email)

      if (!user) {
        return {
          success: false,
          message: "Користувача не знайдено",
        }
      }

      return {
        success: true,
        message: "Пароль успішно змінено",
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: `${user.name} ${user.surname}`,
        },
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return {
        success: false,
        message: "Помилка при скиданні пароля",
      }
    }
  },
}
