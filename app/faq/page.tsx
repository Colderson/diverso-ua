"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "@/components/language-provider"

export default function FaqPage() {
  const { t } = useTranslation()

  const faqItems = [
    {
      question: t("faqDeliveryUkraine"),
      answer: t("faqDeliveryUkraineAnswer"),
    },
    {
      question: t("faqDeliveryAbroad"),
      answer: t("faqDeliveryAbroadAnswer"),
    },
    {
      question: t("faqPayment"),
      answer: t("faqPaymentAnswer"),
    },
    {
      question: t("faqReturns"),
      answer: t("faqReturnsAnswer"),
    },
    {
      question: t("faqFitsAllPassports"),
      answer: t("faqFitsAllPassportsAnswer"),
    },
    {
      question: t("faqCustomDesign"),
      answer: t("faqCustomDesignAnswer"),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("faq"), href: "/faq" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("faq")}</h1>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
