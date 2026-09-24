/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Canvas & Surface ─────────────────────────────────────────────
        base:          "#F7F5F2",   // Warm pearl canvas
        surface:       "#FFFFFF",   // Pure card white
        surfaceSubtle: "#F3F0EC",   // Warm tinted surface
        surfaceMid:    "#EDE9E3",   // Medium warm surface
        // ── Borders ──────────────────────────────────────────────────────
        border: {
          DEFAULT: "#E8E2D9",       // Warm stone border
          subtle:  "#F0ECE6",       // Extra light border
          strong:  "#D5CCBF",       // Stronger divider
        },
        // ── Text ─────────────────────────────────────────────────────────
        text: {
          main:  "#1A1814",         // Deep charcoal (warm black)
          muted: "#6B6457",         // Warm taupe muted
          light: "#A09589",         // Light warm gray
          inv:   "#FDFCFA",         // Inverted (on dark bg)
        },
        // ── Brand Gradient Endpoints ──────────────────────────────────────
        // Primary: rose-coral → amber  (use with bg-gradient-to-r from-brand to-brand-end)
        brand: {
          DEFAULT: "#C1455D",       // Deep rose-coral
          hover:   "#A8364D",       // Darker rose on hover
          end:     "#D4863C",       // Warm amber gradient end
          light:   "#FAF0F2",       // Tinted brand background
          border:  "#EDBBBC",       // Soft rose border
          muted:   "#E8C4C8",       // Very muted rose
        },
        // ── Secondary Accent: Forest Teal ─────────────────────────────────
        teal: {
          DEFAULT: "#1E6B5E",       // Forest teal
          hover:   "#165248",
          light:   "#EBF5F3",
          border:  "#A8D4CC",
        },
        // ── Warm Amber Accent ─────────────────────────────────────────────
        amber: {
          DEFAULT: "#D4863C",
          hover:   "#BE7530",
          light:   "#FDF4EA",
          border:  "#F0CEAB",
        },
        // ── Status Colors ─────────────────────────────────────────────────
        status: {
          open:       "#1E5FAD",
          inProgress: "#C47A1E",
          resolved:   "#1E6B5E",
          breached:   "#C1455D",
          onHold:     "#6B6457",
        },
        // ── Utility Accents ───────────────────────────────────────────────
        accent: {
          sky:     "#0EA5E9",
          violet:  "#7C3AED",
          emerald: "#059669",
          rose:    "#E11D48",
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm:  '6px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        'xs':     '0 1px 2px 0 rgba(26, 24, 20, 0.04)',
        'subtle': '0 1px 4px 0 rgba(26, 24, 20, 0.05), 0 1px 2px -1px rgba(26, 24, 20, 0.04)',
        'sm':     '0 2px 4px 0 rgba(26, 24, 20, 0.06)',
        'md':     '0 4px 12px -2px rgba(26, 24, 20, 0.08), 0 2px 6px -2px rgba(26, 24, 20, 0.05)',
        'lg':     '0 12px 24px -4px rgba(26, 24, 20, 0.10), 0 4px 8px -4px rgba(26, 24, 20, 0.06)',
        'xl':     '0 24px 40px -8px rgba(26, 24, 20, 0.12), 0 8px 16px -8px rgba(26, 24, 20, 0.06)',
        'glow-brand': '0 0 24px -4px rgba(193, 69, 93, 0.30)',
        'glow-teal':  '0 0 24px -4px rgba(30, 107, 94, 0.25)',
        'inner-subtle': 'inset 0 1px 0 0 rgba(255,255,255,0.8)',
      },
      backgroundImage: {
        // The hero gradient — rose → amber
        'gradient-brand': 'linear-gradient(135deg, #C1455D 0%, #D4863C 100%)',
        // Soft tinted bg for hero sections
        'gradient-canvas': 'linear-gradient(160deg, #F7F5F2 0%, #F3EDE8 40%, #EDE9E3 100%)',
        // Sidebar gradient
        'gradient-dark': 'linear-gradient(180deg, #1C1916 0%, #211D18 100%)',
        // Soft card shimmer
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #FAF8F5 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
