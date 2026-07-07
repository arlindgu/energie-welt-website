type ToggleBinding = {
  triggerId: string
  fieldId: string
  showWhen: (el: HTMLInputElement | HTMLSelectElement) => boolean
}

const bindings: ToggleBinding[] = [
  {
    triggerId: "objektzustand",
    fieldId: "objektzustand-anderes-field",
    showWhen: (el) => el.value === "Anderes",
  },
  {
    triggerId: "dachtyp",
    fieldId: "dachtyp-anderes-field",
    showWhen: (el) => el.value === "Anderes",
  },
  {
    triggerId: "leistung-sonstiges-cb",
    fieldId: "leistung-sonstiges-field",
    showWhen: (el) => (el as HTMLInputElement).checked,
  },
  {
    triggerId: "anhang-typ",
    fieldId: "anhang-typ-anderes-field",
    showWhen: (el) => el.value === "Sonstiges",
  },
]

const boundFields = bindings
  .map(({ triggerId, fieldId, showWhen }) => {
    const trigger = document.getElementById(triggerId) as
      | HTMLInputElement
      | HTMLSelectElement
      | null
    const field = document.getElementById(fieldId) as HTMLElement | null
    if (!trigger || !field) return null

    const sync = () => field.classList.toggle("hidden", !showWhen(trigger))
    trigger.addEventListener("change", sync)
    return field
  })
  .filter((field): field is HTMLElement => field !== null)

export function resetConditionalFields() {
  boundFields.forEach((field) => field.classList.add("hidden"))
}
