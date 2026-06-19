import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          foreground: 'hsl(var(--surface-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neon: {
          cyan: 'hsl(var(--neon-cyan))',
          purple: 'hsl(var(--neon-purple))',
          gold: 'hsl(var(--neon-gold))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px hsl(var(--primary) / 0.45), 0 0 40px hsl(var(--primary) / 0.2)',
        'glow-cyan-lg': '0 0 30px hsl(var(--primary) / 0.55), 0 0 60px hsl(var(--primary) / 0.25)',
        'glow-purple': '0 0 20px hsl(var(--secondary) / 0.45), 0 0 40px hsl(var(--secondary) / 0.2)',
        'glow-gold': '0 0 20px hsl(var(--accent) / 0.5), 0 0 40px hsl(var(--accent) / 0.25)',
        'glow-success': '0 0 16px hsl(var(--success) / 0.4)',
        'glow-danger': '0 0 16px hsl(var(--destructive) / 0.4)',
        glass: '0 8px 32px hsl(222 47% 4% / 0.45)',
      },
      backgroundImage: {
        'game-mesh': `
          radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.18), transparent),
          radial-gradient(ellipse 60% 40% at 100% 50%, hsl(var(--secondary) / 0.12), transparent),
          radial-gradient(ellipse 50% 30% at 0% 80%, hsl(var(--accent) / 0.08), transparent)
        `,
        'card-shine': 'linear-gradient(135deg, hsl(var(--foreground) / 0.06) 0%, transparent 50%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.15), inset 0 1px 0 hsl(var(--foreground) / 0.1)',
          },
          '50%': {
            boxShadow:
              '0 0 32px hsl(var(--primary) / 0.65), 0 0 64px hsl(var(--primary) / 0.3), inset 0 1px 0 hsl(var(--foreground) / 0.15)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
      maxWidth: {
        game: '28rem',
        content: '42rem',
        wide: '56rem',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
