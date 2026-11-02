import Link from 'next/link';
import VerseText from '@/components/VerseText';
import { MAPS } from '@/data/maps';
import { getVerse, dayOfVerse, verseRange } from '@/lib/verses';
import { firstWords, lastWords, toArabicDigits } from '@/lib/arabic';

// ألوان الفروع بالتناوب (معرّفة في globals.css)
const HUES = ['var(--hue-1)', 'var(--hue-2)', 'var(--hue-3)', 'var(--hue-4)', 'var(--hue-5)'];

function rangeLabel(start, end) {
  return start === end ? toArabicDigits(start) : `${toArabicDigits(start)}–${toArabicDigits(end)}`;
}

// ref مثل "40-46" أو "62"
function refLabel(ref) {
  return toArabicDigits(ref).replace('-', '–');
}

// الخريطة الذهنية: العقدة المركزية في اليمين، والفروع في اليسار، يربطها خط عمودي.
// كل فرع عنصر <details> يُفتح لقراءة نص آياته، بدون أي جافاسكربت.
export default function MindMap({ mapKey }) {
  const map = MAPS[mapKey];

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {/* العقدة المركزية */}
      <div className="relative shrink-0 rounded-3xl bg-primary p-5 text-center text-on-primary md:sticky md:top-20 md:w-52 md:after:absolute md:after:-end-6 md:after:top-10 md:after:w-6 md:after:border-t-2 md:after:border-line">
        <h2 className="font-display text-3xl font-bold">{map.center}</h2>
        <p className="mt-1 opacity-90">{toArabicDigits(map.sub)}</p>
      </div>

      {/* الفروع */}
      <ol className="min-w-0 flex-1 space-y-3 border-s-2 border-line ps-6">
        {map.branches.map((branch, i) => (
          <Branch key={branch.start} branch={branch} color={HUES[i % HUES.length]} />
        ))}
      </ol>
    </div>
  );
}

function Branch({ branch, color }) {
  const nextVerse = branch.end + 1;
  const isLast = nextVerse > 286;
  const day = dayOfVerse(branch.start);

  return (
    <li
      style={{ '--c': color }}
      className="relative before:absolute before:-start-6 before:top-7 before:w-6 before:border-t-2 before:border-line"
    >
      <details className="group card !p-0">
        <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-start gap-3 p-4">
          <span className="whitespace-nowrap rounded-lg bg-[var(--c)] px-2.5 py-0.5 text-sm font-semibold text-card">
            {rangeLabel(branch.start, branch.end)}
          </span>
          <span>
            <span className="block font-display text-xl font-bold">{branch.title}</span>
            {branch.hook && <span className="block text-sm text-muted">{toArabicDigits(branch.hook)}</span>}
            {branch.note && <span className="mt-1 inline-block rounded-full bg-soft px-2 text-xs">{branch.note}</span>}
          </span>
          <span className="mt-1 text-muted transition group-open:rotate-180">▾</span>
        </summary>

        {/* النقاط الفرعية */}
        {branch.points && (
          <ul className="flex flex-wrap gap-1.5 px-4 pb-3">
            {branch.points.map((point) => (
              <li key={point.ref} className="flex gap-1.5 rounded-lg bg-soft px-2.5 py-0.5 text-sm">
                <b className="whitespace-nowrap text-[var(--c)]">{refLabel(point.ref)}</b>
                <span>{toArabicDigits(point.text)}</span>
              </li>
            ))}
          </ul>
        )}

        {/* نقطة الانتقال إلى الفرع التالي: هنا يحدث الخلط عادة */}
        <p className="flex flex-wrap items-baseline gap-x-3 border-t border-dashed border-line px-4 py-3 text-sm text-muted">
          <span>{isLast ? 'نهاية السورة:' : 'الانتقال:'}</span>
          <span className="font-quran text-lg text-ink">
            … <span className="text-accent">{lastWords(getVerse(branch.end), 4)}</span> ﴿{toArabicDigits(branch.end)}﴾
          </span>
          {!isLast && (
            <>
              <span>←</span>
              <span className="font-quran text-lg text-ink">{firstWords(getVerse(nextVerse), 4)} …</span>
            </>
          )}
        </p>

        {/* نص الآيات: يظهر عند فتح الفرع */}
        <div className="border-t border-line px-4 pb-4 pt-2">
          <p className="mushaf">
            {verseRange(branch.start, branch.end).map((n) => (
              <span key={n}>
                <VerseText number={n} />{' '}
              </span>
            ))}
          </p>
          {day > 0 && (
            <Link href={`/tafsir/${day}#v${branch.start}`} className="text-sm text-primary underline">
              اقرأ الشرح وأسباب النزول
            </Link>
          )}
        </div>
      </details>
    </li>
  );
}
