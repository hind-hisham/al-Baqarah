import VerseText from '@/components/VerseText';
import MemorizedToggle from '@/components/MemorizedToggle';
import { TAFSIR } from '@/data/tafsir';
import { ASBAB, GRADE_LABELS } from '@/data/asbab';
import { toArabicDigits } from '@/lib/arabic';

// بطاقة آية كاملة: النص ثم الشرح ثم سبب النزول (إن وُجد) ثم زر «حفظتها».
export default function VerseCard({ number }) {
  // أسباب النزول التي تشمل هذه الآية
  const reasons = ASBAB.filter((item) => item.verses.includes(number));

  return (
    <article id={`v${number}`} className="card scroll-mt-20">
      <p className="mushaf">
        <VerseText number={number} />
      </p>

      <p className="mt-3 leading-8">{TAFSIR[number]}</p>

      {reasons.map((reason, i) => (
        <div key={i} className="mt-4 rounded-xl bg-soft p-4 text-sm leading-7">
          <p className="mb-1 font-semibold text-primary">
            سبب النزول
            <span className="ms-2 rounded-full bg-card px-2 py-0.5 text-xs font-normal text-muted">
              {GRADE_LABELS[reason.grade]}
            </span>
          </p>
          <p>{reason.text}</p>
          <p className="mt-1 text-xs text-muted">المصدر: {reason.source}</p>
          {reason.verses.length > 1 && (
            <p className="mt-1 text-xs text-muted">
              تشمل الآيات: {reason.verses.map(toArabicDigits).join('، ')}
            </p>
          )}
        </div>
      ))}

      <div className="mt-4">
        <MemorizedToggle verse={number} />
      </div>
    </article>
  );
}
