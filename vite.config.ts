import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_PATH || '/TemaJawa/',
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://api.qinvi.id',
        changeOrigin: true,
      },
    },
  },
})
