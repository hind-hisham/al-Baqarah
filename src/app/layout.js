import './globals.css';
import { Amiri, Amiri_Quran, IBM_Plex_Sans_Arabic } from 'next/font/google';
import NavBar from '@/components/NavBar';

// الخطوط: تتحول إلى متغيرات CSS ثم يستعملها tailwind.config.js
const fontUi = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-ui',
});
const fontDisplay = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-display',
});
const fontQuran = Amiri_Quran({
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-quran',
});

export const metadata = {
  title: 'خريطة حفظ البقرة',
  description: 'خطة أسبوع لحفظ سورة البقرة: خرائط ذهنية، تدريب على الربط، الفواصل، المتشابهات، الشرح وأسباب النزول.',
};

// هذا القالب يلف كل صفحات الموقع: الشريط العلوي ثم محتوى الصفحة
export default function RootLayout({ children }) {
  const fonts = `${fontUi.variable} ${fontDisplay.variable} ${fontQuran.variable}`;

  return (
    <html lang="ar" dir="rtl" className={fonts}>
      <body>
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
