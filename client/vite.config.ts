import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()
  ],
  // css: {
  //   postcss: {
  //     plugins: [tailwindcss()],
  //   },
  // },
  server: {
    port: 5002, // change here
    proxy: {
      '/api': {
        target: 'http://localhost:5001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
