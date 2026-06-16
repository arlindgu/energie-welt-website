// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, fontProviders } from "astro/config"
import node from "@astrojs/node"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
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
            src: ["./src/assets/fonts/Archivo-Variable.woff2"],
          },
        ],
      },
    },
  ],
})
