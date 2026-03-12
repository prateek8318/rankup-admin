import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        // Browser APIs
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        
        // Network APIs
        fetch: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        
        // Timer APIs
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        
        // Performance APIs
        performance: 'readonly',
        PerformanceResourceTiming: 'readonly',
        
        // HTML Elements & Interfaces
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        HTMLVideoElement: 'readonly',
        HTMLAudioElement: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        Image: 'readonly',
        
        // React
        React: 'readonly',
        
        // Node.js (for build tools)
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        
        // TypeScript Types
        HeadersInit: 'readonly',
        RequestInit: 'readonly',
        BodyInit: 'readonly',
        ResponseInit: 'readonly',
        
        // Utility Types
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks
    },
    rules: {
      // Console & Debugging
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'off',
      
      // React Rules
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      
      // TypeScript Rules
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      
      // General Rules - Only critical ones
      'prefer-const': 'off',
      'no-unused-vars': 'off',
      'no-var': 'warn',
      'prefer-arrow-callback': 'off',
      'arrow-spacing': 'off',
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'comma-dangle': 'off',
      'semi': 'off',
      'quotes': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
      'coverage/**',
      '.next/**',
      '.nuxt/**',
      '.out/**'
    ]
  }
];
