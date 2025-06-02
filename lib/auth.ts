import { supabase } from "./supabase"

export interface AuthResult {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    phone: string
    name: string
    surname: string
  }
}

export const userService = {
  async checkUserByPhone(phone: string) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single()
    return data
  },

  async checkUserByEmail(email: string) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()
    return data
  },

  async checkPhoneAndEmailMatch(phone: string, email: string) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .eq("email", email)
      .single()
    return !!data
  },

  async createUser(user: {
    id: string
    email: string
    phone: string
    name: string
    surname: string
  }) {
    const { data, error } = await supabase.from("users").insert([user]).select().single()
    if (error) {
      console.error("Error creating user in DB:", error)
      return null
    }
    return data
  },

  async updatePassword(userId: string) {
    const { error } = await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", userId)
    return !error
  },
}

export const authService = {
  async login(phone: string, password: string): Promise<AuthResult> {
    try {
      const user = await userService.checkUserByPhone(phone)

      if (!user) {
        return {
          success: false,
          message: "Користувача не знайдено",
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      })

      if (error) {
        return {
          success: false,
          message: "Невірний пароль",
        }
      }

      return {
        success: true,
        message: "Успішний вхід",
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,         // тільки ім'я!
          surname: user.surname,   // тільки прізвище!
        },
      }
    } catch (error) {
      return {
        success: false,
        message: "Помилка входу в систему",
      }
    }
  },

  async register(userData: {
    email: string
    phone: string
    password: string
    name: string
    surname: string
  }): Promise<AuthResult> {
    try {
      const existingPhone = await userService.checkUserByPhone(userData.phone)
      if (existingPhone) {
        return {
          success: false,
          message: "Користувач з таким номером телефону вже існує",
        }
      }

      const existingEmail = await userService.checkUserByEmail(userData.email)
      if (existingEmail) {
        return {
          success: false,
          message: "Користувач з такою електронною поштою вже існує",
        }
      }

      // Створення облікового запису в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError || !authData.user) {
        return {
          success: false,
          message: authError?.message || "Не вдалося створити обліковий запис",
        }
      }

      // Додавання до таблиці users
      const dbUser = await userService.createUser({
        id: authData.user.id,
        email: userData.email,
        phone: userData.phone,
        name: userData.name,
        surname: userData.surname,
      })

      if (!dbUser) {
        return {
          success: false,
          message: "Помилка при створенні користувача в базі",
        }
      }

      return {
        success: true,
        message: "Успішна реєстрація",
        user: {
          id: dbUser.id,
          email: dbUser.email,
          phone: dbUser.phone,
          name: dbUser.name, // тільки ім'я
          surname: dbUser.surname,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Помилка реєстрації. Спробуйте ще раз",
      }
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/reset-password"
            : "https://diverso.pp.ua/reset-password",
      })

      if (error) {
        return { success: false, message: "Не вдалося надіслати лист" }
      }

      return { success: true, message: "Лист надіслано" }
    } catch (err) {
      return { success: false, message: "Помилка при скиданні пароля" }
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut()
  },
}
