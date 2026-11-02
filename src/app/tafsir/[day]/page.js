import Link from 'next/link';
import { notFound } from 'next/navigation';
import VerseCard from '@/components/VerseCard';
import { DAYS } from '@/data/days';
import { getDay, verseRange } from '@/lib/verses';
import { toArabicDigits } from '@/lib/arabic';

export function generateStaticParams() {
  return DAYS.map((day) => ({ day: String(day.id) }));
}

// صفحة يوم واحد: كل آياته مع الشرح وأسباب النزول
export default async function TafsirDayPage({ params }) {
  const { day: dayId } = await params;
  const day = getDay(dayId);
  if (!day) notFound();

  const previous = getDay(day.id - 1);
  const next = getDay(day.id + 1);

  return (
    <>
      <h1 className="page-title">
        اليوم {toArabicDigits(day.id)}: الآيات {toArabicDigits(day.start)}–{toArabicDigits(day.end)}
      </h1>
      <p className="page-lead">{day.title}</p>

      <div className="space-y-4">
        {verseRange(day.start, day.end).map((n) => (
          <VerseCard key={n} number={n} />
        ))}
      </div>

      {/* التنقل بين الأيام */}
      <div className="mt-8 flex justify-between gap-3">
        {previous ? (
          <Link href={`/tafsir/${previous.id}`} className="btn">
            → اليوم {toArabicDigits(previous.id)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/tafsir/${next.id}`} className="btn btn-primary">
            اليوم {toArabicDigits(next.id)} ←
          </Link>
        )}
      </div>
    </>
  );
}
