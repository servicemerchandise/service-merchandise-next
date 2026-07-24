/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta desde el logo Service Merchandise
        sm: {
          50: '#EEF4FA',
          100: '#D7E5F2',
          200: '#B0CAE5',
          300: '#8DA9C4',
          400: '#5E7FA8',
          500: '#13315C', // azul corporativo medio
          600: '#0F2A50',
          700: '#0B2545', // azul corporativo oscuro (principal)
          800: '#081B36',
          900: '#061327',
          accent: '#3A86FF', // azul claro brillante
        },
        ink: {
          DEFAULT: '#0B2545',
          muted: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(11 37 69 / 0.06)',
        DEFAULT: '0 4px 12px -2px rgb(11 37 69 / 0.08), 0 2px 4px -2px rgb(11 37 69 / 0.04)',
        lg: '0 16px 40px -8px rgb(11 37 69 / 0.18)',
        glow: '0 0 0 4px rgb(58 134 255 / 0.18)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0B2545 0%, #13315C 50%, #1B4A8A 100%)',
        'gradient-card': 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFD 100%)',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};