/** @type {import('tailwindcss').Config} */
module.exports = {
  // أي ملف داخل src يُقرأ لاستخراج أسماء الأصناف (classes)
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // الألوان معرّفة كمتغيرات في src/app/globals.css
      // لذلك يتبدل الوضع الفاتح والداكن تلقائيا بدون كتابة dark: في كل مكان.
      colors: {
        page: 'var(--page)',
        card: 'var(--card)',
        soft: 'var(--soft)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        primary: 'var(--primary)',
        'on-primary': 'var(--on-primary)',
        accent: 'var(--accent)',
        mark: 'var(--mark-bg)',
        'mark-ink': 'var(--mark-ink)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
      },
      // الخطوط تُحمّل في src/app/layout.js
      fontFamily: {
        ui: ['var(--font-ui)', 'Tahoma', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        quran: ['var(--font-quran)', 'var(--font-display)', 'serif'],
      },
    },
  },
  plugins: [],
};
