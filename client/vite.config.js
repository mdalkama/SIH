import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const enableHttps = process.env.VITE_HTTPS === 'true'

  return {
    base: '/',
    plugins: [
      react({ jsxRuntime: 'automatic' }),
      tailwindcss()
    ],
    server: {
      https: enableHttps || false,
      proxy: {
        '/api/v1': {
          target: 'https://sih-4ptm.onrender.com',
          changeOrigin: true,
          secure: true
        }
      }
    },
    // ✅ Add this part
    build: {
      // Split big libraries into separate chunks
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['react-router-dom', 'axios'] // add other big deps here
          }
        }
      },
      // Optional: raise the warning limit (kB) so it doesn’t spam the console
      chunkSizeWarningLimit: 2000
    }
  }
})
