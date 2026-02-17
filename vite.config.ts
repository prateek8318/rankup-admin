import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Auth service
      '/api/admin/auth': {
        target: 'http://192.168.1.21:56923',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('auth proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Auth Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Auth Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Main dashboard service
      '/api/admin/dashboard': {
        target: 'http://192.168.1.21:56923',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('dashboard proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Dashboard Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Dashboard Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Users service on port 5002
      '/api/admin/users': {
        target: 'http://192.168.1.21:5002',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('users proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Users Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Users Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Exams service on port 5000
      '/api/exams': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('exams proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Exams Request to the Target:', req.method, req.url);
            console.log('Target URL:', options.target + (req.url || ''));
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Exams Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Try alternative path for exams
      '/exams': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('exams alternative proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Exams Alternative Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Exams Alternative Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Fallback for other API calls
      '/api': {
        target: 'http://192.168.1.21:56923',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
