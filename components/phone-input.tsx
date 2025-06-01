"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

type PhoneInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  id?: string
}

export function PhoneInput({ value, onChange, placeholder, required, className, id }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (value) {
      setDisplayValue(value)
    } else if (!isFocused) {
      setDisplayValue("")
    }
  }, [value, isFocused])

  const handleFocus = () => {
    setIsFocused(true)
    if (!value) {
      setDisplayValue("+380")
      onChange("+380")
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (value === "+380") {
      setDisplayValue("")
      onChange("")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Always ensure +380 prefix when user is typing
    if (newValue && !newValue.startsWith("+380")) {
      newValue = "+380" + newValue.replace(/^\+?380?/, "")
    }

    // Prevent deletion of +380 prefix
    if (newValue.length < 4 && isFocused) {
      newValue = "+380"
    }

    setDisplayValue(newValue)
    onChange(newValue)
  }

  return (
    <Input
      id={id}
      type="tel"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={isFocused ? "" : placeholder || "+38(012)-345-67-89"}
      required={required}
      className={className}
    />
  )
}
