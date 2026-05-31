import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { xl: '1200px', '2xl': '1200px' },
    },
    extend: {
      colors: {
        site: {
          bg:      '#111318',
          surface: '#1a1f2e',
          edge:    '#2a3040',
          blue:    '#0078d4',
          amber:   '#f59e0b',
          text:    '#e2e8f0',
          muted:   '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body':         '#e2e8f0',
            '--tw-prose-headings':     '#e2e8f0',
            '--tw-prose-lead':         '#94a3b8',
            '--tw-prose-links':        '#0078d4',
            '--tw-prose-bold':         '#e2e8f0',
            '--tw-prose-counters':     '#94a3b8',
            '--tw-prose-bullets':      '#2a3040',
            '--tw-prose-hr':           '#2a3040',
            '--tw-prose-quotes':       '#94a3b8',
            '--tw-prose-quote-borders':'#0078d4',
            '--tw-prose-captions':     '#94a3b8',
            '--tw-prose-code':         '#f59e0b',
            '--tw-prose-pre-code':     '#e2e8f0',
            '--tw-prose-pre-bg':       '#1a1f2e',
            '--tw-prose-th-borders':   '#2a3040',
            '--tw-prose-td-borders':   '#2a3040',
          },
        },
      }),
    },
  },
  plugins: [typography],
};
