import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
      hmr: {
        clientPort: 443
      },
    // Host: '0.0.0.0' makes the server accessible from any local network interface
    host: '0.0.0.0',
    // Allow any cloudflare tunnel domain and local development
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.trycloudflare.com',
      '.cloudflareaccess.com',
      'app.heliumdevicemanager.com',
    ],
    cors: true,
    // Optionally specify port if needed
    // port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  // Exclude all test files from normal application build
  build: {
    rollupOptions: {
      external: [
        // Exclude test files from the build
        /\/__tests__\//,
        /\.test\.[tj]sx?$/,
        /\.spec\.[tj]sx?$/
      ],
    }
  }
})


