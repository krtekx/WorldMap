import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        target: 'esnext', // Target modern browsers to avoid legacy polyfills using eval
        modulePreload: {
            polyfill: false // Disable module preload polyfill which uses eval
        },
        // Temporary: Don't empty dist to avoid Dropbox locking
        emptyOutDir: false,
        // Use default esbuild minification (safer for CSP than terser in some cases)
        minify: 'esbuild',
        sourcemap: false
    }
})
