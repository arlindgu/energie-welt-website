import { resetConditionalFields } from "./toggles"
import { hideAddressSuggestions } from "./address-autocomplete"
import { clearFileList } from "./file-upload"

const form = document.getElementById("offerte-form") as HTMLFormElement
const btn = document.getElementById("submit-btn") as HTMLButtonElement
const btnText = document.getElementById("submit-text") as HTMLSpanElement
const feedback = document.getElementById("form-feedback") as HTMLDivElement

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  btn.disabled = true
  btnText.textContent = "Wird gesendet..."
  feedback.className = "hidden text-sm rounded-lg px-4 py-3"

  try {
    const res = await fetch("/api/offerte", {
      method: "POST",
      body: new FormData(form),
    })

    let json: { error?: string } = {}
    try {
      json = await res.json()
    } catch {
      // Response wasn't JSON (e.g. a platform error page for an oversized request)
    }

    if (res.ok) {
      feedback.textContent = "Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns bald!"
      feedback.className =
        "text-sm rounded-lg px-4 py-3 bg-brand-50 text-brand-800 border border-brand-100"
      form.reset()
      resetConditionalFields()
      hideAddressSuggestions()
      clearFileList()
    } else {
      feedback.textContent =
        json.error ??
        (res.status === 413
          ? "Ihre Anhänge sind zu gross. Bitte laden Sie kleinere Dateien hoch."
          : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
      feedback.className = "text-sm rounded-lg px-4 py-3 bg-red-50 text-red-700 border border-red-200"
    }
  } catch {
    feedback.textContent =
      "Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
    feedback.className = "text-sm rounded-lg px-4 py-3 bg-red-50 text-red-700 border border-red-200"
  } finally {
    btn.disabled = false
    btnText.textContent = "Offerte anfordern"
  }
})
