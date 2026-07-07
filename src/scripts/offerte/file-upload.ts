const fileInput = document.getElementById("anhaenge") as HTMLInputElement
const fileList = document.getElementById("file-list") as HTMLDivElement

export function clearFileList() {
  fileList.innerHTML = ""
}

fileInput.addEventListener("change", () => {
  clearFileList()
  Array.from(fileInput.files ?? []).forEach((file) => {
    const el = document.createElement("div")
    el.className = "flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span class="truncate">${file.name}</span><span class="ml-auto shrink-0 text-muted-foreground">${(file.size / 1024 / 1024).toFixed(1)} MB</span>`
    fileList.appendChild(el)
  })
})
