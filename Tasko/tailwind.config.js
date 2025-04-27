/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 0 rgba(139, 92, 246, 0)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }
        }
      },
      colors: {
        violet: {
          50: '#f8f6fe',
          100: '#f0ebfd',
          200: '#e4dbfb',
          300: '#d0bff8',
          400: '#b599f4',
          500: '#9a6eef',
          600: '#8649e7',
          700: '#7435d1',
          800: '#612dac',
          900: '#51288c',
          950: '#321760',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-grid': 'linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.4)',
        'bento': '0 2px 4px rgba(139, 92, 246, 0.1), 0 12px 24px rgba(139, 92, 246, 0.1)',
        'bento-hover': '0 4px 8px rgba(139, 92, 246, 0.2), 0 16px 32px rgba(139, 92, 246, 0.15)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        'bento': '2rem',
      },
      gridTemplateColumns: {
        'bento-1': 'repeat(1, minmax(0, 1fr))',
        'bento-2': 'repeat(2, minmax(0, 1fr))',
        'bento-3': 'repeat(3, minmax(0, 1fr))',
        'bento-4': 'repeat(4, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        'bento-1': 'repeat(1, minmax(0, 1fr))',
        'bento-2': 'repeat(2, minmax(0, 1fr))',
        'bento-3': 'repeat(3, minmax(0, 1fr))',
        'bento-4': 'repeat(4, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};