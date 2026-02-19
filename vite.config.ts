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
        target: 'http://192.168.1.21:56924',
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
        target: 'http://192.168.1.21:56924',
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
      // Admin Subscription Plans service
      '/api/admin/subscription-plans': {
        target: 'http://192.168.1.21:56925',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('admin subscription-plans proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Admin Subscription Plans Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Admin Subscription Plans Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Admin Users service
      '/api/admin/users': {
        target: 'http://192.168.1.21:5002', // User Service port
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
      // User count endpoints
      '/api/admin/users/count': {
        target: 'http://192.168.1.19:5002',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('users count proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Users Count Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Users Count Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/api/admin/users/daily-active-count': {
        target: 'http://192.168.1.19:5002',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('daily active count proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Daily Active Count Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Daily Active Count Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Admin Exams service
      '/api/exams': {
        target: 'http://localhost:5003', // Correct port where ExamService is running
        changeOrigin: true,
        secure: false, // HTTP for local development
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('admin exams proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Admin Exams Request to the Target:', req.method, req.url);
            console.log('Target URL:', `${options.target || ''}${req.url || ''}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Admin Exams Response from the Target:', proxyRes.statusCode, req.url);
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.log('Error response headers:', proxyRes.headers);
              let body = '';
              proxyRes.on('data', chunk => {
                body += chunk.toString();
              });
              proxyRes.on('end', () => {
                console.log('Error response body:', body);
              });
            }
          });
        }
      },
      // Categories service (exam-categories, qualifications, streams)
      '/api/categories': {
        target: 'http://192.168.1.21:5009',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('categories proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Categories Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Categories Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Master service (languages, states, countries)
      '/api/languages': {
        target: 'http://192.168.1.21:5009',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('languages proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Languages Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Languages Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/api/states': {
        target: 'http://192.168.1.21:5009',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('states proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending States Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received States Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/api/countries': {
        target: 'http://192.168.1.21:5009',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('countries proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Countries Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Countries Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
