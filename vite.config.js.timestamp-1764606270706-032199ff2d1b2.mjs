// vite.config.js
import { defineConfig } from "file:///Z:/MISS3%20Dropbox/Server%20Data/printednest/Antigravity/WorldMap/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  base: "/",
  build: {
    target: "esnext",
    // Target modern browsers to avoid legacy polyfills using eval
    modulePreload: {
      polyfill: false
      // Disable module preload polyfill which uses eval
    },
    // Temporary: Don't empty dist to avoid Dropbox locking
    emptyOutDir: false,
    // Disable minification features that use eval()
    minify: "terser",
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
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJaOlxcXFxNSVNTMyBEcm9wYm94XFxcXFNlcnZlciBEYXRhXFxcXHByaW50ZWRuZXN0XFxcXEFudGlncmF2aXR5XFxcXFdvcmxkTWFwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJaOlxcXFxNSVNTMyBEcm9wYm94XFxcXFNlcnZlciBEYXRhXFxcXHByaW50ZWRuZXN0XFxcXEFudGlncmF2aXR5XFxcXFdvcmxkTWFwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9aOi9NSVNTMyUyMERyb3Bib3gvU2VydmVyJTIwRGF0YS9wcmludGVkbmVzdC9BbnRpZ3Jhdml0eS9Xb3JsZE1hcC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogJy8nLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICB0YXJnZXQ6ICdlc25leHQnLCAvLyBUYXJnZXQgbW9kZXJuIGJyb3dzZXJzIHRvIGF2b2lkIGxlZ2FjeSBwb2x5ZmlsbHMgdXNpbmcgZXZhbFxyXG4gICAgICAgIG1vZHVsZVByZWxvYWQ6IHtcclxuICAgICAgICAgICAgcG9seWZpbGw6IGZhbHNlIC8vIERpc2FibGUgbW9kdWxlIHByZWxvYWQgcG9seWZpbGwgd2hpY2ggdXNlcyBldmFsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBUZW1wb3Jhcnk6IERvbid0IGVtcHR5IGRpc3QgdG8gYXZvaWQgRHJvcGJveCBsb2NraW5nXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxyXG4gICAgICAgIC8vIERpc2FibGUgbWluaWZpY2F0aW9uIGZlYXR1cmVzIHRoYXQgdXNlIGV2YWwoKVxyXG4gICAgICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICAgICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICAgICAgICBjb21wcmVzczoge1xyXG4gICAgICAgICAgICAgICAgLy8gRGlzYWJsZSBldmFsLWJhc2VkIG9wdGltaXphdGlvbnNcclxuICAgICAgICAgICAgICAgIHVuc2FmZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1bnNhZmVfY29tcHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdW5zYWZlX0Z1bmN0aW9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVuc2FmZV9tYXRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVuc2FmZV9tZXRob2RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVuc2FmZV9wcm90bzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1bnNhZmVfcmVnZXhwOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVuc2FmZV91bmRlZmluZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1hbmdsZToge1xyXG4gICAgICAgICAgICAgICAgLy8gRW5zdXJlIG5vIGV2YWwgdXNhZ2UgaW4gbWFuZ2xpbmdcclxuICAgICAgICAgICAgICAgIGV2YWw6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdDoge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGNvbW1lbnRzXHJcbiAgICAgICAgICAgICAgICBjb21tZW50czogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gRW5zdXJlIHNvdXJjZSBtYXBzIGRvbid0IHVzZSBldmFsXHJcbiAgICAgICAgc291cmNlbWFwOiBmYWxzZVxyXG4gICAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlYLFNBQVMsb0JBQW9CO0FBRXRaLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ1gsVUFBVTtBQUFBO0FBQUEsSUFDZDtBQUFBO0FBQUEsSUFFQSxhQUFhO0FBQUE7QUFBQSxJQUViLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNYLFVBQVU7QUFBQTtBQUFBLFFBRU4sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsaUJBQWlCO0FBQUEsUUFDakIsYUFBYTtBQUFBLFFBQ2IsZ0JBQWdCO0FBQUEsUUFDaEIsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2Ysa0JBQWtCO0FBQUEsTUFDdEI7QUFBQSxNQUNBLFFBQVE7QUFBQTtBQUFBLFFBRUosTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFFBQVE7QUFBQTtBQUFBLFFBRUosVUFBVTtBQUFBLE1BQ2Q7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUVBLFdBQVc7QUFBQSxFQUNmO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
