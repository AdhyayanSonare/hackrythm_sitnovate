/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#4FD1C5",
                "primary-glow": "rgba(79, 209, 197, 0.6)",
                secondary: "#7C3AED",
                "background-dark": "#050b14",
                "glass-dark": "rgba(15, 23, 42, 0.55)",
                "glass-border": "rgba(255, 255, 255, 0.12)",
                "accent-cyan": "#22d3ee",
                "accent-red": "#f87171",
                "accent-green": "#4ade80",
                "accent-amber": "#fbbf24",
                "text-primary": "#F8FAFC",
                "text-secondary": "#CBD5E1",
            },
            fontFamily: {
                display: ["Orbitron", "sans-serif"],
                body: ["Rajdhani", "sans-serif"],
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'float-slow': 'float 8s ease-in-out infinite',
                'float-medium': 'float 6s ease-in-out infinite',
                'float-fast': 'float 4s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 12s linear infinite',
                'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
            },
            cursor: {
                'crosshair': 'crosshair',
            },
            backgroundImage: {
                'map-overlay': "linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.8))",
            }
        },
    },
    plugins: [],
}
