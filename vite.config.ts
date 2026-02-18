import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/lti': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('ace-builds') || id.includes('react-ace')) {
                return 'editor-vendor';
              }
              if (id.includes('@google/genai')) {
                return 'genai-vendor';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              return 'vendor'; // Remaining dependencies
            }
          }
        }
      }
    },
    plugins: [react()],
    define: {
      // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
