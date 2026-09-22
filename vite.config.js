import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `npm run dev:full` sets SATTVA_API so the dev site talks to the local API.
// Plain `npm run dev` has no backend and behaves exactly like the static site.
const api = process.env.SATTVA_API

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: api
    ? { proxy: { '/api': api, '/img': api } }
    : undefined,
})
