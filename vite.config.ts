import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base so the build works on GitHub Pages at both
  // https://<user>.github.io/ and https://<user>.github.io/<repo>/
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Keep Three.js out of the initial bundle: it is only pulled in by the lazily imported 3D engine.
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
});
