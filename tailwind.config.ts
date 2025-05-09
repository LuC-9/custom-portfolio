import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
      extend: {
          colors: {
              border: 'hsl(var(--border))',
              background: 'hsl(var(--background))',
              foreground: 'hsl(var(--foreground))',
              card: {
                  DEFAULT: 'hsl(var(--card))',
                  foreground: 'hsl(var(--card-foreground))'
              },
              popover: {
                  DEFAULT: 'hsl(var(--popover))',
                  foreground: 'hsl(var(--popover-foreground))'
              },
              primary: {
                  DEFAULT: 'hsl(var(--primary))',
                  foreground: 'hsl(var(--primary-foreground))'
              },
              secondary: {
                  DEFAULT: 'hsl(var(--secondary))',
                  foreground: 'hsl(var(--secondary-foreground))'
              },
              muted: {
                  DEFAULT: 'hsl(var(--muted))',
                  foreground: 'hsl(var(--muted-foreground))'
              },
              accent: {
                  DEFAULT: 'hsl(var(--accent))',
                  foreground: 'hsl(var(--accent-foreground))'
              },
              destructive: {
                  DEFAULT: 'hsl(var(--destructive))',
                  foreground: 'hsl(var(--destructive-foreground))'
              },
          },
          fontFamily: {
              sans: ['var(--font-mono)'],
              mono: ['var(--font-mono)'],
          },
          keyframes: {
              'accordion-down': {
                  from: {
                      height: '0'
                  },
                  to: {
                      height: 'var(--radix-accordion-content-height)'
                  }
              },
              'accordion-up': {
                  from: {
                      height: 'var(--radix-accordion-content-height)'
                  },
                  to: {
                      height: '0'
                  }
              }
          },
          animation: {
              'accordion-down': 'accordion-down 0.2s ease-out',
              'accordion-up': 'accordion-up 0.2s ease-out'
          }
      }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;




