import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // servwer za react
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // laravel server
        changeOrigin: false,
      },
    },
  },
})
