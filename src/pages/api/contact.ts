import type { APIRoute } from "astro"
import { Resend } from "resend"
import { site } from "@/config/site"

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const vorname = data.get("vorname")?.toString().trim()
  const nachname = data.get("nachname")?.toString().trim()
  const email = data.get("email")?.toString().trim()
  const betreff = data.get("betreff")?.toString().trim()
  const nachricht = data.get("nachricht")?.toString().trim()

  if (!vorname || !nachname || !email || !betreff || !nachricht) {
    return new Response(JSON.stringify({ error: "Alle Felder sind erforderlich." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: `${site.name} <onboarding@resend.dev>`,
    to: site.contact.email,
    replyTo: email,
    subject: `Kontaktanfrage: ${betreff}`,
    html: `
      <p><strong>Name:</strong> ${vorname} ${nachname}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      <p><strong>Betreff:</strong> ${betreff}</p>
      <p><strong>Nachricht:</strong></p>
      <p>${nachricht.replace(/\n/g, "<br>")}</p>
    `,
  })

  if (error) {
    return new Response(JSON.stringify({ error: "E-Mail konnte nicht gesendet werden." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
