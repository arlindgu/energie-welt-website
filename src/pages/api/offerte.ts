import type { APIRoute } from "astro"
import { Resend } from "resend"
import { site } from "@/config/site"
import { jsonError, jsonSuccess } from "@/lib/api-response"

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const name = data.get("name")?.toString().trim()
  const email = data.get("email")?.toString().trim()
  const telefon = data.get("telefon")?.toString().trim()
  const strasse = data.get("strasse")?.toString().trim()
  const plz = data.get("plz")?.toString().trim()
  const ort = data.get("ort")?.toString().trim()
  const objektzustand = data.get("objektzustand")?.toString().trim()
  const objektzustand_anderes = data.get("objektzustand_anderes")?.toString().trim()
  const gebaeude_typ = data.get("gebaeude_typ")?.toString().trim()
  const dachtyp = data.get("dachtyp")?.toString().trim()
  const dachtyp_anderes = data.get("dachtyp_anderes")?.toString().trim()
  const verbrauch = data.get("verbrauch")?.toString().trim()
  const leistungen = data.getAll("leistungen").map((v) => v.toString())
  const leistungen_sonstiges = data.get("leistungen_sonstiges")?.toString().trim()
  const anhang_typ = data.get("anhang_typ")?.toString().trim()
  const anhang_typ_sonstiges = data.get("anhang_typ_sonstiges")?.toString().trim()

  if (!name || !email || !strasse || !plz || !ort || !objektzustand || !gebaeude_typ || !dachtyp) {
    return jsonError("Bitte füllen Sie alle Pflichtfelder aus.")
  }

  // Build attachments from uploaded PDFs
  const uploadedFiles = data.getAll("anhaenge") as File[]
  const attachments: { filename: string; content: Buffer }[] = []
  for (const file of uploadedFiles) {
    if (file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({ filename: file.name, content: buffer })
    }
  }

  const objektzustandLabel =
    objektzustand === "Anderes" && objektzustand_anderes
      ? `Anderes: ${objektzustand_anderes}`
      : objektzustand

  const dachtypLabel =
    dachtyp === "Anderes" && dachtyp_anderes
      ? `Anderes: ${dachtyp_anderes}`
      : dachtyp

  const leistungenLabel = leistungen.length
    ? leistungen
        .map((l) => (l === "Sonstiges" && leistungen_sonstiges ? `Sonstiges: ${leistungen_sonstiges}` : l))
        .join(", ")
    : "Keine Angabe"

  const anhangTypLabel =
    anhang_typ === "Sonstiges" && anhang_typ_sonstiges
      ? `Sonstiges: ${anhang_typ_sonstiges}`
      : anhang_typ

  const resend = new Resend(import.meta.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: `${site.name} <info@energie-welt.ch>`,
    to: site.contact.email,
    replyTo: email,
    subject: `Offertanfrage von ${name}`,
    attachments,
    html: `
      <h2>Neue Offertanfrage</h2>

      <h3>Persönliche Angaben</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${telefon || "Keine Angabe"}</p>

      <h3>Objektadresse</h3>
      <p><strong>Adresse:</strong> ${strasse}, ${plz} ${ort}</p>
      <p><strong>Objektzustand:</strong> ${objektzustandLabel}</p>
      <p><strong>Gebäudetyp:</strong> ${gebaeude_typ}</p>

      <h3>Objekt und Projektdetails</h3>
      <p><strong>Dachtyp:</strong> ${dachtypLabel}</p>
      <p><strong>Stromverbrauch:</strong> ${verbrauch ? `${verbrauch} kWh/Jahr` : "Keine Angabe"}</p>

      <h3>Anfragedetails</h3>
      <p><strong>Gewünschte Leistungen:</strong> ${leistungenLabel}</p>

      ${
        attachments.length
          ? `<h3>Anhänge</h3>${anhangTypLabel ? `<p><strong>Art:</strong> ${anhangTypLabel}</p>` : ""}<p>${attachments.map((a) => a.filename).join(", ")}</p>`
          : ""
      }
    `,
  })

  if (error) {
    console.error("[offerte] Resend error:", error)
    return jsonError("Anfrage konnte nicht gesendet werden.", 500)
  }

  return jsonSuccess()
}
