import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 👇 Fix cho sockjs-client
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  base: process.env.VITE_BASE_PATH || "/",
})