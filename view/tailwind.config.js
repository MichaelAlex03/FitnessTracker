/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Modern dark background palette
        primary: {
          DEFAULT: "#0A0E1A", // Deep navy blue background
          light: "#141925",   // Lighter variant
          lighter: "#1E2433", // Even lighter for cards
        },
        // Vibrant gradient accent colors
        accent: {
          DEFAULT: "#6366F1",     // Vibrant indigo
          light: "#818CF8",       // Light indigo
          purple: "#A855F7",      // Purple
          pink: "#EC4899",        // Pink
          orange: "#F97316",      // Orange
          green: "#10B981",       // Success green
          red: "#EF4444",         // Error red
        },
        // Keep secondary for compatibility but modernize
        secondary: {
          DEFAULT: "#6366F1",
          100: "#818CF8",
          200: "#A5B4FC",
        },
        // Enhanced surface colors
        surface: {
          DEFAULT: "#1E2433",     // Card background
          elevated: "#252D3F",    // Elevated card
          hover: "#2D3548",       // Hover state
        },
        // Better gray scale
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        // Keep black for compatibility
        black: {
          DEFAULT: "#000",
          100: "#1E2433",
          200: "#252D3F",
        },
        // Success, warning, error states
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 30px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}
