// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, fontProviders } from "astro/config"
import vercel from "@astrojs/vercel"
import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercel(),
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Inter-Variable.ttf"],
          },
        ],
      },
    },
  ],
})
