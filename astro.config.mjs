// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, fontProviders } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Clash Display",
      cssVariable: "--font-clash-display",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/ClashDisplay-Bold.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Archivo",
      cssVariable: "--font-archivo",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Archivo-Regular.woff2"],
          },
        ],
      },
    },
  ],
})
