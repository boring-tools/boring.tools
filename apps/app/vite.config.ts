import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../build/app',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [TanStackRouterVite(), react()],
})
