import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0', 
      port: 5173,
      proxy: {
        '/api/admin/auth': {
          target: `${API_BASE_URL}:56924`,
          changeOrigin: true,
          secure: false,
        },
        '/api/admin/dashboard': {
          target: `${API_BASE_URL}:56924`,
          changeOrigin: true,
          secure: false,
        },
        '/api/admin/subscription-plans': {
          target: `${API_BASE_URL}:56925`,
          changeOrigin: true,
          secure: false,
        },
        '/api/user/subscriptions': {
          target: `${API_BASE_URL}:56925`,
          changeOrigin: true,
          secure: false,
        },
        '/api/admin/user-subscriptions': {
          target: `${API_BASE_URL}:56925`,
          changeOrigin: true,
          secure: false,
        },
        '/api/admin/users': {
          target: `${API_BASE_URL}:5002`,
          changeOrigin: true,
          secure: false,
        },
        '/api/exams': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/categories': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/qualifications': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/streams': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/languages': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/states': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/countries': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
        '/api/subjects': {
          target: `${API_BASE_URL}:5009`,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})