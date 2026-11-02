import Link from 'next/link';
import { ASBAB, GRADE_LABELS } from '@/data/asbab';
import { dayOfVerse } from '@/lib/verses';
import { toArabicDigits } from '@/lib/arabic';

export const metadata = { title: 'أسباب النزول | خريطة حفظ البقرة' };

// قائمة بكل أسباب النزول مرتبة بحسب الآيات، وكل سبب يفتح الآية في صفحة الشرح
export default function AsbabPage() {
  const items = [...ASBAB].sort((a, b) => a.verses[0] - b.verses[0]);

  return (
    <>
      <h1 className="page-title">أسباب النزول</h1>
      <p className="page-lead">
        ليست لكل آية سبب نزول معروف، وهذه المشهور منها. بجانب كل سبب بيان درجة توثيقه ومن رواه. ما كان في الصحيحين أقوى مما
        في كتب التفسير التي تتفاوت أسانيدها، فيُرجع في الأخيرة إلى كتب أهل العلم.
      </p>

      <div className="space-y-4">
        {items.map((item, i) => {
          const first = item.verses[0];
          return (
            <article key={i} className="card">
              <header className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold">
                  الآية {item.verses.map(toArabicDigits).join('، ')}
                </h2>
                <span className="rounded-full bg-soft px-2.5 py-0.5 text-xs">{GRADE_LABELS[item.grade]}</span>
              </header>
              <p className="leading-8">{item.text}</p>
              <p className="mt-2 text-sm text-muted">المصدر: {item.source}</p>
              <Link href={`/tafsir/${dayOfVerse(first)}#v${first}`} className="mt-2 inline-block text-sm text-primary underline">
                اقرأ الآية مع شرحها
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
