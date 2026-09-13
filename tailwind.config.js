/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          // The ends of the accent gradient, for the rare spot that needs one
          // of them on its own (a chart stop, an icon on a lit surface).
          bright: 'hsl(var(--primary-bright))',
          deep: 'hsl(var(--primary-deep))',
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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      boxShadow: {
        // The halo under an accent surface, as a utility for one-offs.
        glow: '0 6px 24px -8px hsl(var(--primary) / 0.55)',
        'glow-sm': '0 0 12px -2px hsl(var(--primary) / 0.45)',
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 6px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      spacing: {
        // Safe areas for installed PWAs on iOS.
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-t': 'env(safe-area-inset-top)',
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
      // `h-touch w-touch` (Button size="icon") needs the scale on height/width
      // too — minHeight/minWidth alone leave those classes ungenerated.
      height: {
        touch: '48px',
      },
      width: {
        touch: '48px',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'pop-in': 'pop-in 180ms cubic-bezier(0.2, 0.9, 0.3, 1)',
        'slide-up': 'slide-up 220ms cubic-bezier(0.2, 0.9, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
