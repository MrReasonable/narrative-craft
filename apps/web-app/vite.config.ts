import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  server: {
    port: Number.parseInt(process.env.WEB_APP_PORT || '3001'),
  },
  plugins: [solid()],
})
