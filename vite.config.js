import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // expose on your local network (same as --host)
    port: 5173,
    strictPort: true, // fail instead of silently switching ports
    watch: {
      // Large media in /public never needs watching; on Windows it can
      // be locked by VS Code's preview and throw EBUSY.
      ignored: ['**/public/mp4/**'],
    },
  },
  preview: {
    host: true, // same for `npm run preview`
  },
})