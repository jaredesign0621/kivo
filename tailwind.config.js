/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        bg: {
          base: '#FFFFFF',
          panel: '#F6F7FB',
        },
        neutral: {
          main: '#172B4D',
          meta: '#757D8C',
        },
        status: {
          todo: { bg: '#F4F5F7', text: '#42526E' },
          inProgress: { bg: '#DEEBFF', text: '#0747A6' },
          done: { bg: '#E3FCEF', text: '#006644' },
          warning: { bg: '#FFEBE6', text: '#DE350B' }
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '1.4', fontWeight: '700' }],
        'h2': ['22px', { lineHeight: '1.45', fontWeight: '600' }],
        'body': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'ui': ['13px', { lineHeight: '1.3', fontWeight: '500' }],
        'code': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'md': '8px',
      },
      maxWidth: {
        'workspace': '1760px',
      },
      gap: {
        'gutter': '16px',
      },
      boxShadow: {
        'floating': '0 4px 12px rgba(9, 30, 66, 0.15)',
      }
    },
  },
  plugins: [],
}
