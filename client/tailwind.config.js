/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FAF9F6",       // Warm off-white background
        surface: "#FFFFFF",    // Clean card surface
        border: {
          DEFAULT: "#E8E5DE",  // Subtle warm gray border
          subtle: "#F0ECE1",
        },
        text: {
          main: "#22201C",     // Warm charcoal primary text
          muted: "#6B6559",    // Muted secondary text
          light: "#8F897C",
        },
        brand: {
          DEFAULT: "#B5502F",  // Deep terracotta primary accent
          hover: "#9C4224",
          light: "#FDF5F2",
          border: "#E9BFB1",
        },
        accent: {
          DEFAULT: "#3E5C76",  // Muted slate blue secondary accent
          light: "#F0F4F8",
        },
        status: {
          open: "#3E5C76",     // Muted blue
          inProgress: "#B5822F", // Muted amber
          resolved: "#3D6B4F", // Muted green
          breached: "#9C3B2E", // Muted brick red
          onHold: "#6B6559",   // Muted gray
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      fontSize: {
        '2xs': ['11px', '14px'],
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['15px', '22px'],
        'lg': ['18px', '26px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '38px'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(34, 32, 28, 0.04)',
        'sm': '0 1px 3px 0 rgba(34, 32, 28, 0.06), 0 1px 2px 0 rgba(34, 32, 28, 0.03)',
        'md': '0 4px 6px -1px rgba(34, 32, 28, 0.07), 0 2px 4px -1px rgba(34, 32, 28, 0.04)',
      },
    },
  },
  plugins: [],
}
