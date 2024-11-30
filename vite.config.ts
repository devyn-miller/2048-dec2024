import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/2048/',  // Updated to match your repository name
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
