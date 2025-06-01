import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const name = formData.get("name")
  const phone = formData.get("phone")
  const contactMethod = formData.get("contactMethod")
  const username = formData.get("username")
  const designDescription = formData.get("designDescription")
  const comments = formData.get("comments")
  const file = formData.get("file") as File | null

  // Налаштуйте свій SMTP (gmail або інший)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // ваш gmail
      pass: process.env.GMAIL_PASS, // пароль або app password
    },
  })

  let attachments = []
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer())
    attachments.push({
      filename: file.name,
      content: buffer,
    })
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: "diverso.ua.2024@gmail.com",
    subject: "Custom Design Request",
    text: `
      Name: ${name}
      Phone: ${phone}
      Contact Method: ${contactMethod}
      Username: ${username}
      Design Description: ${designDescription}
      Comments: ${comments}
    `,
    attachments,
  })

  return NextResponse.json({ ok: true })
}