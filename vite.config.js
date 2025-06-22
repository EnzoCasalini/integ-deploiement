import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/integ-deploiement' : '/',
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: "./setupTests.js",
    environment: "jsdom",
    coverage: {
      provider: 'istanbul',
      exclude: ["src/main.jsx", "src/App.jsx", "src/pages/Home/Home.jsx", "cypress", "cypress.config.js"],
    },
  },
});