import type { APIRoute } from "astro"
import { Resend } from "resend"
import { site } from "@/config/site"

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const name = data.get("name")?.toString().trim()
  const email = data.get("email")?.toString().trim()
  const telefon = data.get("telefon")?.toString().trim()
  const strasse = data.get("strasse")?.toString().trim()
  const plz = data.get("plz")?.toString().trim()
  const ort = data.get("ort")?.toString().trim()
  const dachart = data.get("dachart")?.toString().trim()
  const dachart_sonstiges = data.get("dachart_sonstiges")?.toString().trim()
  const verbrauch = data.get("verbrauch")?.toString().trim()

  if (!name || !email || !strasse || !plz || !ort || !dachart) {
    return new Response(JSON.stringify({ error: "Bitte füllen Sie alle Pflichtfelder aus." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: `${site.name} <info@energie-welt.ch>`,
    to: site.contact.email,
    replyTo: email,
    subject: `Offertanfrage von ${name}`,
    html: `
      <h2>Neue Offertanfrage</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${telefon || "–"}</p>
      <hr />
      <p><strong>Adresse:</strong> ${strasse}, ${plz} ${ort}</p>
      <p><strong>Dachart:</strong> ${dachart}${dachart === "Sonstiges" && dachart_sonstiges ? ` – ${dachart_sonstiges}` : ""}</p>
      <p><strong>Stromverbrauch:</strong> ${verbrauch ? `${verbrauch} kWh/Jahr` : "–"}</p>
    `,
  })

  if (error) {
    console.error("[offerte] Resend error:", error)
    return new Response(JSON.stringify({ error: "Anfrage konnte nicht gesendet werden." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
