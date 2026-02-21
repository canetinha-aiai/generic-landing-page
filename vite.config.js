import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '011e-2804-d59-8117-4d00-8d11-9c58-100e-9e41.ngrok-free.app'
    ]
  }
})
