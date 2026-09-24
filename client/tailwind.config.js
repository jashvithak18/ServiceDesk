/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FAF9F6",       // Warm off-white canvas
        surface: "#FFFFFF",    // Clean card surface
        surfaceSubtle: "#F8FAFC", // Light tinted surface
        border: {
          DEFAULT: "#E2E8F0",  // Soft slate border
          subtle: "#F1F5F9",
          brand: "#FDBA74",
        },
        text: {
          main: "#0F172A",     // Slate-900 primary text
          muted: "#64748B",    // Slate-500 secondary text
          light: "#94A3B8",
        },
        brand: {
          DEFAULT: "#4F46E5",  // Premium Indigo primary accent
          hover: "#4338CA",
          light: "#EEF2FF",
          border: "#C7D2FE",
          terracotta: "#B5502F",
        },
        accent: {
          DEFAULT: "#0EA5E9",  // Sky blue secondary accent
          teal: "#0D9488",
          violet: "#8B5CF6",
          amber: "#D97706",
          emerald: "#059669",
          rose: "#E11D48",
          light: "#F0F9FF",
        },
        status: {
          open: "#2563EB",     // Vivid blue
          inProgress: "#D97706", // Warm amber
          resolved: "#059669", // Emerald green
          breached: "#DC2626", // Brick red
          onHold: "#64748B",   // Muted slate
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        'sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'md': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 20px -5px rgba(79, 70, 229, 0.25)',
      },
    },
  },
  plugins: [],
}
