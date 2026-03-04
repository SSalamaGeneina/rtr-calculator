import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/rtr-calculator/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'rtr-calculator.js',
        assetFileNames: 'rtr-calculator.[ext]',
      },
    },
  },
})
