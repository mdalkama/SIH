import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const enableHttps = process.env.VITE_HTTPS === 'true'
  return {
    plugins: [react(), tailwindcss()],
    server: {
      https: enableHttps ? true : false,
      proxy: {
        '/api/v1': {
          target: 'https://sih-4ptm.onrender.com',
          changeOrigin: true,
          secure: true,
        }
      }
    }
  }
})
