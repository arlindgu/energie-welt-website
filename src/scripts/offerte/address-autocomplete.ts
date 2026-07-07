// Strasse-Autocomplete via geo.admin.ch (Swiss address search, keyless public API)
const strasseInput = document.getElementById("strasse") as HTMLInputElement
const plzInput = document.getElementById("plz") as HTMLInputElement
const ortInput = document.getElementById("ort") as HTMLInputElement
const suggestionsBox = document.getElementById("strasse-suggestions") as HTMLDivElement
let suggestionsDebounce: ReturnType<typeof setTimeout>

export function hideAddressSuggestions() {
  suggestionsBox.classList.add("hidden")
  suggestionsBox.innerHTML = ""
}

strasseInput.addEventListener("input", () => {
  const query = strasseInput.value.trim()
  clearTimeout(suggestionsDebounce)

  if (query.length < 3) {
    hideAddressSuggestions()
    return
  }

  suggestionsDebounce = setTimeout(async () => {
    const url = `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=${encodeURIComponent(query)}&type=locations&origins=address&limit=8`
    const res = await fetch(url)
    if (!res.ok) return
    const json = await res.json()
    const results = (json.results ?? []) as { attrs: { label: string } }[]

    if (!results.length) {
      hideAddressSuggestions()
      return
    }

    suggestionsBox.innerHTML = ""
    results.forEach(({ attrs }) => {
      const plainLabel = attrs.label.replace(/<[^>]+>/g, "")
      const item = document.createElement("button")
      item.type = "button"
      item.className = "hover:bg-muted block w-full px-4 py-2.5 text-left text-sm"
      item.textContent = plainLabel
      item.addEventListener("click", () => {
        const match = plainLabel.match(/^(.*?)\s+(\d{4})\s+(.+)$/)
        if (match) {
          strasseInput.value = match[1]
          plzInput.value = match[2]
          ortInput.value = match[3]
        }
        hideAddressSuggestions()
      })
      suggestionsBox.appendChild(item)
    })
    suggestionsBox.classList.remove("hidden")
  }, 300)
})

document.addEventListener("click", (e) => {
  if (!suggestionsBox.contains(e.target as Node) && e.target !== strasseInput) {
    hideAddressSuggestions()
  }
})

strasseInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideAddressSuggestions()
})
