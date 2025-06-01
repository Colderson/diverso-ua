"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "uk" | "en"

type Translations = {
  [key: string]: {
    uk: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  catalog: { uk: "Каталог", en: "Catalog" },
  about: { uk: "Про нас", en: "About Us" },
  faq: { uk: "FAQ", en: "FAQ" },
  home: { uk: "Головна", en: "Home" },

  // Product categories
  categories: { uk: "Категорії", en: "Categories" },
  idCardCovers: { uk: "Чохли на ID-карти", en: "ID Card Covers" },
  wallets: { uk: "Гаманці", en: "Wallets" },
  notebooks: { uk: "Блокноти", en: "Notebooks" },
  documentOrganizers: { uk: "Органайзери для документів", en: "Document Organizers" },
  leatherAccessories: { uk: "Шкіряні аксесуари", en: "Leather Accessories" },

  // Filters
  all: { uk: "Усі", en: "All" },
  movies: { uk: "Кіно та серіали", en: "Movies and TV Shows" },
  cartoons: { uk: "Мультфільми", en: "Cartoons" },
  anime: { uk: "Аніме", en: "Anime" },
  games: { uk: "Ігри", en: "Games" },

  // Product details
  addToCart: { uk: "Додати в кошик", en: "Add to cart" },
  addEngraving: { uk: "Додати гравіювання (+170 ₴)", en: "Add Engraving (+170 ₴)" },
  engravingMessage: {
    uk: "Для обговорення гравіювання з Вами зв'яжеться наш менеджер.",
    en: "Our manager will contact you to discuss engraving details.",
  },
  customEngraving: { uk: "Індивідуальне гравіювання", en: "Custom Engraving" },
  similarProducts: { uk: "Схожі товари", en: "Similar Products" },
  price: { uk: "Ціна", en: "Price" },
  sku: { uk: "Артикул", en: "SKU" },
  color: { uk: "Колір", en: "Color" },

  // Cart
  cart: { uk: "Кошик", en: "Cart" },
  emptyCart: { uk: "Ваш кошик порожній", en: "Your cart is empty" },
  goToCatalog: { uk: "Перейти до каталогу", en: "Go to catalog" },
  goToCatalogDescription: {
    uk: "Перейдіть до каталогу, щоб додати товари в кошик",
    en: "Go to the catalog to add items to your cart",
  },
  quantity: { uk: "Кількість", en: "Quantity" },
  remove: { uk: "Видалити", en: "Remove" },
  total: { uk: "Разом", en: "Total" },
  proceedToCheckout: { uk: "Перейти до оформлення", en: "Proceed to Checkout" },

  // Account
  account: { uk: "Особистий кабінет", en: "Account" },
  login: { uk: "Увійти", en: "Login" },
  register: { uk: "Зареєструватися", en: "Register" },
  personalInfo: { uk: "Особисті дані", en: "Personal Info" },
  shippingInfo: { uk: "Інформація про доставку", en: "Shipping Info" },
  orderHistory: { uk: "Історія замовлень", en: "Order History" },
  getSmsCode: { uk: "Отримати СМС-код", en: "Get SMS Code" },
  verifyCode: { uk: "Перевірити код", en: "Verify Code" },
  smsCode: { uk: "СМС-код", en: "SMS Code" },
  enterSmsCode: { uk: "Введіть код з СМС", en: "Enter SMS code" },
  authDescription: {
    uk: "Йой, схоже Ви не авторизований користувач. Для входу в особистий кабінет авторизуйтесь, або зареєструйтесь, якщо Ви у нас вперше :)",
    en: "Oops, it seems you are not an authorized user. To access your personal account, please log in or register if you are new here :)",
  },

  // Form fields
  name: { uk: "Ім'я", en: "Name" },
  surname: { uk: "Прізвище", en: "Surname" },
  firstName: { uk: "Ім'я", en: "First Name" },
  lastName: { uk: "Прізвище", en: "Last Name" },
  phone: { uk: "Телефон", en: "Phone" },
  phoneNumber: { uk: "Номер телефону", en: "Phone Number" },
  email: { uk: "Email", en: "Email" },
  city: { uk: "Місто", en: "City" },
  save: { uk: "Зберегти", en: "Save" },

  // UI elements
  call: { uk: "Зателефонувати", en: "Call" },
  toggleTheme: { uk: "Змінити тему", en: "Toggle theme" },
  toggleLanguage: { uk: "Змінити мову", en: "Toggle language" },
  viewAll: { uk: "Дивитись усі", en: "View all" },
  toHome: { uk: "На головну", en: "To Home" },
  search: { uk: "Пошук", en: "Search" },
  close: { uk: "Закрити", en: "Close" },

  // Banner texts
  bannerTitle1: { uk: "Diverso UA – майстерня гарного настрою", en: "Diverso UA – workshop of good mood" },
  bannerDesc1: { uk: "Унікальні дизайни для вашої ID-картки", en: "Unique designs for your ID card" },
  bannerTitle2: { uk: "Hello Kitty", en: "Hello Kitty" },
  bannerDesc2: {
    uk: "Стильні шкіряні чохли з улюбленими персонажами",
    en: "Stylish leather covers with favorite characters",
  },
  bannerTitle3: { uk: "Аніме колекція", en: "Anime Collection" },
  bannerDesc3: { uk: "Чохли з персонажами з популярних аніме", en: "Covers with characters from popular anime" },
  bannerTitle4: { uk: "Breaking Bad", en: "Breaking Bad" },
  bannerDesc4: { uk: "Чохли з персонажами з улюблених серіалів", en: "Covers with characters from favorite series" },
  viewButton: { uk: "Переглянути", en: "View" },

  // Cart page
  items: { uk: "Товари", en: "Items" },
  delivery: { uk: "Доставка", en: "Delivery" },
  novaPoshtaRates: { uk: "За тарифами Нової Пошти", en: "According to Nova Poshta rates" },
  toPay: { uk: "До сплати:", en: "To pay:" },
  placeOrder: { uk: "Оформити замовлення", en: "Place order" },
  engravingNote: {
    uk: "Для обговорення гравіювання з Вами зв'яжеться наш менеджер.",
    en: "Our manager will contact you to discuss engraving details.",
  },

  // Checkout
  checkout: { uk: "Оформлення замовлення", en: "Checkout" },
  orderDetails: { uk: "Деталі замовлення", en: "Order Details" },
  paymentMethod: { uk: "Спосіб оплати", en: "Payment Method" },
  cashOnDelivery: { uk: "Накладений платіж", en: "Cash on Delivery" },
  prepayment: { uk: "Передоплата", en: "Prepayment" },
  shippingDetails: { uk: "Деталі доставки", en: "Shipping Details" },
  fullName: { uk: "Повне ім'я", en: "Full Name" },
  selectCity: { uk: "Виберіть місто", en: "Select City" },
  selectBranch: { uk: "Виберіть відділення", en: "Select Branch" },
  novaPoshtaBranch: { uk: "Відділення Нової Пошти", en: "Nova Poshta Branch" },
  doNotCall: { uk: "Не передзвонювати", en: "Do not call" },
  orderSuccess: {
    uk: "Дякуємо за замовлення, воно прийнято в роботу.",
    en: "Thank you for your order, it has been accepted for processing.",
  },
  managerContact: {
    uk: "Найближчим часом з Вами зв'яжеться наш менеджер.",
    en: "Our manager will contact you shortly.",
  },
  smsSent: {
    uk: "СМС-код відправлено на ваш номер телефону",
    en: "SMS code has been sent to your phone number",
  },
  invalidPhone: {
    uk: "Будь ласка, введіть правильний номер телефону",
    en: "Please enter a valid phone number",
  },
  enterSmsCodePrompt: {
    uk: "Будь ласка, введіть код з СМС",
    en: "Please enter the SMS code",
  },
  smsCodeVerified: {
    uk: "Код підтверджено успішно!",
    en: "Code verified successfully!",
  },
  smsCodeIncorrect: {
    uk: "Невірний код. Спробуйте ще раз.",
    en: "Incorrect code. Please try again.",
  },

  // FAQ
  faqDeliveryUkraine: {
    uk: "Як здійснюється доставка по Україні?",
    en: "How is delivery carried out in Ukraine?",
  },
  faqDeliveryUkraineAnswer: {
    uk: "Доставка здійснюється через Нову Пошту. Термін доставки - 1-3 робочих дні після відправлення замовлення.",
    en: "Delivery is carried out through Nova Poshta. Delivery time is 1-3 working days after order dispatch.",
  },
  faqDeliveryAbroad: {
    uk: "Як здійснюється доставка за межі України?",
    en: "How is delivery carried out outside Ukraine?",
  },
  faqDeliveryAbroadAnswer: {
    uk: "Доставка за межі України здійснюється через міжнародні служби доставки. Термін доставки залежить від країни призначення і становить від 7 до 21 дня.",
    en: "Delivery outside Ukraine is carried out through international delivery services. Delivery time depends on the destination country and ranges from 7 to 21 days.",
  },
  faqPayment: {
    uk: "Як здійснюється оплата?",
    en: "How is payment made?",
  },
  faqPaymentAnswer: {
    uk: "Ми приймаємо оплату через банківський переказ, оплату карткою онлайн або накладений платіж при отриманні (тільки для України).",
    en: "We accept payment via bank transfer, online card payment, or cash on delivery (Ukraine only).",
  },
  faqReturns: {
    uk: "Які умови повернення товару?",
    en: "What are the return conditions?",
  },
  faqReturnsAnswer: {
    uk: "Ви можете повернути товар протягом 14 днів з моменту отримання, якщо він не був у використанні і зберіг товарний вигляд. Індивідуальні замовлення не підлягають поверненню.",
    en: "You can return the product within 14 days of receipt if it has not been used and retains its original appearance. Custom orders are not returnable.",
  },
  faqFitsAllPassports: {
    uk: "Чи підходить чохол до всіх паспортів?",
    en: "Does the cover fit all passports?",
  },
  faqFitsAllPassportsAnswer: {
    uk: "Наші чохли розроблені спеціально для українських ID-карток. Розміри стандартні - 54×85 мм.",
    en: "Our covers are designed specifically for Ukrainian ID cards. Standard dimensions are 54×85 mm.",
  },
  faqCustomDesign: {
    uk: "Чи можна замовити індивідуальний дизайн?",
    en: "Can I order a custom design?",
  },
  faqCustomDesignAnswer: {
    uk: "Так, ми пропонуємо послугу створення індивідуального дизайну. Ви можете заповнити форму на нашому сайті, і ми зв'яжемося з вами для обговорення деталей.",
    en: "Yes, we offer custom design services. You can fill out the form on our website, and we will contact you to discuss the details.",
  },

  // Footer
  contacts: { uk: "Контакти", en: "Contacts" },
  workingHours: { uk: "Години роботи", en: "Working Hours" },
  navigation: { uk: "Навігація", en: "Navigation" },
  allRightsReserved: { uk: "Всі права захищені", en: "All rights reserved" },
  customDesign: { uk: "Індивідуальне замовлення", en: "Custom Design" },
  footerDescription: {
    uk: "Майстерня гарного настрою. Це не просто ID-картка. Це головний герой. Це — ти.",
    en: "Workshop of good mood. It's not just an ID card. It's the main character. It's you.",
  },
  workingTime: { uk: "Пн–Сб: 10:00–18:00", en: "Mon–Sat: 10:00–18:00" },
  address: { uk: "м. Дніпро, вул. Виконкомівська, 69", en: "Dnipro city, Vykonkomivska Street, 69" },

  // Custom design form
  customDesignTitle: { uk: "Індивідуальне замовлення", en: "Custom Design Order" },
  customDesignDescription: {
    uk: "Бажаєте максимум індивідуальності? Ми можемо створити унікальну обкладинку за вашим дизайном. Заповніть форму нижче, і ми зв'яжемося з вами для обговорення деталей.",
    en: "Want maximum individuality? We can create a unique cover based on your design. Fill out the form below and we will contact you to discuss the details.",
  },
  contactMethod: { uk: "Спосіб зв'язку", en: "Contact Method" },
  username: { uk: "Нікнейм у месенджері", en: "Messenger Username" },
  designDescription: { uk: "Опис дизайну", en: "Design Description" },
  uploadImage: { uk: "Завантажити зображення", en: "Upload Image" },
  additionalComments: { uk: "Додаткові коментарі", en: "Additional Comments" },
  sendRequest: { uk: "Відправити запит", en: "Send Request" },
  uploadImageText: { uk: "Натисніть, щоб завантажити зображення", en: "Click to upload image" },
  usernamePlaceholder: { uk: "Ваш нікнейм у вибраному месенджері", en: "Your username in the selected messenger" },
  requestSuccess: {
    uk: "Дякуємо за запит! Ми зв'яжемося з вами найближчим часом.",
    en: "Thank you for your request! We will contact you shortly.",
  },

  // About page
  aboutTitle: { uk: "Про нас", en: "About Us" },
  aboutDescription: {
    uk: "Diverso UA — це український бренд, який спеціалізується на виготовленні шкіряних обкладинок для ID-карток ручної роботи. Ми створюємо унікальні дизайни, які відображають вашу індивідуальність та інтереси. Кожна обкладинка виготовляється з високоякісної шкіри та проходить ретельний контроль якості. Наша місія — зробити повсякденні речі особливими та наповнити їх характером і стилем.",
    en: "Diverso UA is a Ukrainian brand that specializes in handmade leather ID card covers. We create unique designs that reflect your individuality and interests. Each cover is made from high-quality leather and undergoes careful quality control. Our mission is to make everyday things special and fill them with character and style.",
  },
  ourTeam: { uk: "Наша команда", en: "Our Team" },

  // Team member roles
  coFounderTechnologist: { uk: "Співзасновник, технолог", en: "Co-founder, Technologist" },
  coFounderMarketer: { uk: "Співзасновник, маркетолог", en: "Co-founder, Marketer" },
  seamstress: { uk: "Швея", en: "Seamstress" },
  leatherWorker: { uk: "Кожевник", en: "Leather Worker" },
  laserOperator: { uk: "Оператор лазерного верстату", en: "Laser Machine Operator" },

  // Pagination
  showMoreOnPage: { uk: "Показати більше на одній сторінці", en: "Show more on one page" },
  previous: { uk: "Попередня", en: "Previous" },
  next: { uk: "Наступна", en: "Next" },

  // Custom design CTA
  customDesignCTATitle: {
    uk: "Не знайшли чохол з необхідним персонажем?",
    en: "Didn't find a cover with the character you need?",
  },
  customDesignCTADescription: { uk: "Ми можемо зробити індивідуальний дизайн!", en: "We can create a custom design!" },
  customDesignCTAButton: { uk: "Хочу індивідуальний дизайн", en: "I want a custom design" },

  // Profile page
  profile: { uk: "Профіль", en: "Profile" },
  personalData: { uk: "Особисті дані", en: "Personal Data" },
  deliverySettings: { uk: "Налаштування доставки", en: "Delivery Settings" },
  orders: { uk: "Замовлення", en: "Orders" },
  editProfile: { uk: "Редагувати профіль", en: "Edit Profile" },
  logout: { uk: "Вийти", en: "Logout" },
  currentOrder: { uk: "Поточне замовлення: немає", en: "Current order: none" },
  orderHistoryEmpty: { uk: "Історія замовлень: порожня", en: "Order history: empty" },
  notSpecified: { uk: "Не вказано", en: "Not specified" },

  // Product names (these should be translated as they are interface elements)
  productOnePiece: { uk: "Чохол на ID-картку 'One Piece'", en: "ID Card Cover 'One Piece'" },
  productHelloKitty: { uk: "Чохол на ID-картку 'Hello Kitty'", en: "ID Card Cover 'Hello Kitty'" },
  productBreakingBad: { uk: "Чохол на ID-картку 'Breaking Bad'", en: "ID Card Cover 'Breaking Bad'" },
  productNaruto: { uk: "Чохол на ID-картку 'Наруто'", en: "ID Card Cover 'Naruto'" },
  productDescription: {
    uk: "Шкіряний чохол на ID-картку з гравіюванням. Виготовлений з натуральної шкіри найвищої якості.",
    en: "Leather ID card cover with engraving. Made from the highest quality natural leather.",
  },
  // Main page sections
  // categories and viewAll are already defined above, so we remove these duplicates.

  // Product names - add these new translations
  productHarryPotter: { uk: "Чохол на ID-картку 'Гаррі Поттер'", en: "ID Card Cover 'Harry Potter'" },
  productSimpsons: { uk: "Чохол на ID-картку 'Сімпсони'", en: "ID Card Cover 'The Simpsons'" },
  productWitcher: { uk: "Чохол на ID-картку 'Відьмак'", en: "ID Card Cover 'The Witcher'" },
  productPokemon: { uk: "Чохол на ID-картку 'Покемон'", en: "ID Card Cover 'Pokemon'" },
  productFriends: { uk: "Чохол на ID-картку 'Друзі'", en: "ID Card Cover 'Friends'" },
  productRickAndMorty: { uk: "Чохол на ID-картку 'Рік і Морті'", en: "ID Card Cover 'Rick and Morty'" },
  productMinecraft: { uk: "Чохол на ID-картку 'Minecraft'", en: "ID Card Cover 'Minecraft'" },
  productAttackOnTitan: { uk: "Чохол на ID-картку 'Атака титанів'", en: "ID Card Cover 'Attack on Titan'" },

  // Breadcrumb specific translations
  productDetails: { uk: "Деталі продукту", en: "Product Details" },
  personalAccount: { uk: "Особистий кабінет", en: "Personal Account" },
  customDesignOrder: { uk: "Індивідуальне замовлення", en: "Custom Design Order" },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uk")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "uk" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language]
    }
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
