import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типи для наших таблиць
export interface User {
  id: string
  email: string
  phone: string
  password_hash: string
  name: string
  surname: string
  created_at: string
  updated_at: string
}

export interface PasswordResetToken {
  id: string
  user_id: string
  token: string
  expires_at: string
  used: boolean
  created_at: string
}

// Функції для роботи з користувачами
export const userService = {
  // Перевірка існування користувача по телефону
  async checkUserByPhone(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("phone", phone).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user by phone:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error checking user by phone:", error)
      return null
    }
  },

  // Перевірка існування користувача по email
  async checkUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user by email:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error checking user by email:", error)
      return null
    }
  },

  // Створення нового користувача
  async createUser(userData: {
    email: string
    phone: string
    password_hash: string
    name: string
    surname: string
  }): Promise<User | null> {
    try {
      console.log("Creating user with data:", { ...userData, password_hash: "[HIDDEN]" })

      const { data, error } = await supabase.from("users").insert([userData]).select().single()

      if (error) {
        console.error("Supabase error creating user:", error)
        throw error
      }

      console.log("User created successfully:", data)
      return data
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  // Оновлення пароля користувача
  async updatePassword(email: string, newPasswordHash: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)

      if (error) {
        console.error("Error updating password:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Error updating password:", error)
      return false
    }
  },
}

// Функції для роботи з токенами скидання пароля
export const passwordResetService = {
  // Створення токена для скидання пароля
  async createResetToken(userId: string): Promise<string> {
    try {
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 години

      const { error } = await supabase.from("password_reset_tokens").insert([
        {
          user_id: userId,
          token,
          expires_at: expiresAt.toISOString(),
        },
      ])

      if (error) {
        throw error
      }

      return token
    } catch (error) {
      console.error("Error creating reset token:", error)
      throw error
    }
  },

  // Перевірка токена скидання пароля
  async verifyResetToken(token: string): Promise<PasswordResetToken | null> {
    try {
      const { data, error } = await supabase
        .from("password_reset_tokens")
        .select("*")
        .eq("token", token)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error verifying reset token:", error)
      return null
    }
  },

  // Позначення токена як використаного
  async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("password_reset_tokens").update({ used: true }).eq("token", token)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error("Error marking token as used:", error)
      return false
    }
  },
}

// Утиліти для хешування паролів
export const passwordUtils = {
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password)
    return passwordHash === hash
  },
}
