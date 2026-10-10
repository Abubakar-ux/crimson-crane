import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the build also works from a subfolder (itch.io, mobile wrappers).
  base: './',
  // The project may live behind a junction (e.g. Windows app folders); don't resolve through it.
  resolve: { preserveSymlinks: true },
  // Don't ignore public/: Vite only serves public files its watcher knows about.
  // Download into art-source/ first and copy, since a file mid-download can crash the watcher on Windows (EBUSY).
  server: { watch: { ignored: ['**/transcripts/**', '**/art-source/**', '**/.venv/**', '**/walkthrough/**'] } },
})
