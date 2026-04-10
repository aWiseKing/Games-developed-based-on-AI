/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/renderer/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // 游戏主题色
        'game-bg': '#1a1a2e',
        'game-bg-secondary': '#16213e',
        'game-accent': '#e94560',
        'game-text': '#eaeaea',
        'game-gold': '#ffd700',
        // 品质颜色
        'quality-trash': '#888888',
        'quality-common': '#ffffff',
        'quality-uncommon': '#2ecc71',
        'quality-rare': '#3498db',
        'quality-epic': '#9b59b6',
        'quality-legendary': '#f39c12',
      },
      fontFamily: {
        'game': ['Microsoft YaHei', 'PingFang SC', 'sans-serif'],
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
