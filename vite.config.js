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
        // Disable minification features that use eval()
        minify: 'terser',
        terserOptions: {
            compress: {
                // Disable eval-based optimizations
                unsafe: false,
                unsafe_comps: false,
                unsafe_Function: false,
                unsafe_math: false,
                unsafe_methods: false,
                unsafe_proto: false,
                unsafe_regexp: false,
                unsafe_undefined: false
            },
            mangle: {
                // Ensure no eval usage in mangling
                eval: false
            },
            format: {
                // Remove comments
                comments: false
            }
        },
        // Ensure source maps don't use eval
        sourcemap: false
    }
})
