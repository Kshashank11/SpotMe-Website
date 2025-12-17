import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For custom domain, base should be '/'
  // If deploying to github.io/repo-name, change to: base: '/repo-name/'
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
