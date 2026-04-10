import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process entry file
        entry: path.join(__dirname, 'src/main/index.ts'),
        onstart({ startup }) {
          startup()
        },
        vite: {
          build: {
            sourcemap: true,
            minify: false,
            outDir: path.join(__dirname, 'dist-electron/main'),
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      {
        // Preload script entry file - 使用 CommonJS 格式
        entry: path.join(__dirname, 'src/preload/index.ts'),
        onstart({ reload }) {
          reload()
        },
        vite: {
          build: {
            sourcemap: true,
            minify: false,
            outDir: path.join(__dirname, 'dist-electron/preload'),
            lib: {
              entry: path.join(__dirname, 'src/preload/index.ts'),
              formats: ['cjs'],
              fileName: () => 'index.js',
            },
            rollupOptions: {
              external: ['electron'],
              output: {
                format: 'cjs',
                exports: 'named',
              },
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@main': path.resolve(__dirname, './src/main'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },
  root: './src/renderer',
  base: './',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  publicDir: '../../public',
})
