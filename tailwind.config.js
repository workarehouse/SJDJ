/** @type {import('tailwindcss').Config} */
const animate = require('tailwindcss-animate')
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

export default {
    darkMode: ['class'],
    content: ['./index.html', './pages/**/*.{ts,tsx,vue}', './components/**/*.{ts,tsx,vue}', './src/**/*.{ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans]
            },
            colors: {
                primary: colors.indigo
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                'card-elevated': '0 2px 10px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
                'button-primary': '0 4px 16px rgba(38,126,240,0.38)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [
        require("@tailwindcss/typography"), //Tailwind CSS 排版
        require('@tailwindcss/forms'), //Tailwind CSS 表单
        require('tailwindcss-debug-screens'), //Tailwind CSS 调试屏幕
        animate
    ]
}
