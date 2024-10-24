// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import tailwind from '@astrojs/tailwind'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  outDir: '../../build/page',
  integrations: [react(), tailwind({ nesting: true })],
  server: {
    port: 4020,
  },
  adapter: node({
    mode: 'standalone',
  }),
})
