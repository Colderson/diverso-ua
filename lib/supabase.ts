import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Створюємо клієнт Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типи для наших таблиць
export interface User {
  id: string
  email: string
  phone: string
  name: string
  surname: string
  address?: string
  created_at: string
  updated_at: string
}

// Функції для роботи з користувачами
export const userService = {
  // Перевірка існування користувача по телефону
  async checkUserByPhone(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("phone", phone).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user by phone:", error)
        return null
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
        return null
      }

      return data
    } catch (error) {
      console.error("Error checking user by email:", error)
      return null
    }
  },

  // Перевірка співпадіння телефону та email
  async checkPhoneAndEmailMatch(phone: string, email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("users").select("id").eq("phone", phone).eq("email", email).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking phone and email match:", error)
        return false
      }

      return !!data
    } catch (error) {
      console.error("Error checking phone and email match:", error)
      return false
    }
  },

  // Створення нового користувача (тільки в таблиці users)
  async createUser(user: any) {
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) return null;
    return data; // data містить id, surname та інші поля
  },

  // Оновлення пароля користувача
  async updatePassword(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error updating user record:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating password:", error)
      return false
    }
  },

  // 🔄 Оновлення даних користувача
  async updateUser(userData: {
    id: string
    phone: string
    name: string
    surname: string
    email: string
  }): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          phone: userData.phone,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userData.id)

      return { error }
    } catch (error) {
      console.error("Error updating user:", error)
      return { error }
    }
  },
}

export default supabase
