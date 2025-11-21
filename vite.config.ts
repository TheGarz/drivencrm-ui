import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    (monacoEditorPlugin as any).default({
      languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html']
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api/snappy': {
        target: 'https://api.snappy.com/public-api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/snappy/, ''),
        headers: {
          'X-Api-Key': 'fF6TPhD76jT2ytoTjf9s9cwcz-0L4fBMU0EQeG22zjxtGixQBbuSoJLxrrcpQ5qj'
        }
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
  },
})