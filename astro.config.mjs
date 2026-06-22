// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, fontProviders } from "astro/config"
import vercel from "@astrojs/vercel"
import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Clash Display",
      cssVariable: "--font-clash-display",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/ClashDisplay-Variable.woff2"],
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
            src: ["./src/assets/fonts/Archivo-Variable.woff2"],
          },
        ],
      },
    },
  ],
})
