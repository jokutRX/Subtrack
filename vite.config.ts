import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // @ts-expect-error — рантайм поддерживает extraHOCs, но в типах плагина опция не объявлена
      extraHOCs: ['observer'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    cssMinify: 'esbuild', // отключаем lightningcss — он ломает Tailwind-классы [[2]]
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/recharts/')) return 'vendor-charts'
          if (id.includes('/mobx') || id.includes('@tanstack/react-query'))
            return 'vendor-state'
          if (id.includes('/react-dom/') || id.includes('/react/'))
            return 'vendor-react'
          if (id.includes('/lucide-react/')) return 'vendor-icons'
          if (id.includes('/date-fns/')) return 'vendor-date'
          if (id.includes('@radix-ui/')) return 'vendor-radix'
        },
      },
    },
  },
})