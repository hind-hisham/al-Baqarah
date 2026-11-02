import DayFilter from '@/components/DayFilter';
import VerseSearch from '@/components/VerseSearch';
import { buildEndingGroups } from '@/lib/endings';
import { dayOfVerse } from '@/lib/verses';
import { fromArabicDigits, toArabicDigits } from '@/lib/arabic';

export const metadata = { title: 'الفواصل | خريطة حفظ البقرة' };

// searchParams يأتي من الرابط: /endings?day=2&q=62
export default async function EndingsPage({ searchParams }) {
  const params = await searchParams;
  const activeDay = Number(params.day) || 0;
  const query = (params.q ?? '').toString().trim();
  const verseNumber = parseInt(fromArabicDigits(query), 10);

  const groups = buildEndingGroups()
    .filter((group) => !activeDay || group.days.includes(activeDay))
    .filter((group) => !query || group.items.some((item) => item.verse === verseNumber));

  return (
    <>
      <h1 className="page-title">الفواصل</h1>
      <p className="page-lead">
        كل نهايات الآيات التي تتكرر في السورة، من الأكثر تكرارا. تحت كل فاصلة الكلمات التي تسبقها في كل آية، وهي ما يدلك على
        الآية الصحيحة. اكتب رقم آية لترى المجموعة التي تنتمي إليها.
      </p>

      <VerseSearch activeDay={activeDay} query={query} />
      <DayFilter basePath="/endings" activeDay={activeDay} query={query} />

      {groups.length === 0 && <p className="text-muted">لا توجد مجموعات مطابقة.</p>}

      <div className="space-y-4">
        {groups.map((group) => (
          <article key={group.key} className="card">
            <h2 className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-quran text-3xl text-primary">{group.ending}</span>
              <span className="text-sm text-muted">{toArabicDigits(group.items.length)} مواضع</span>
            </h2>

            {group.hint && <p className="my-3 max-w-3xl rounded-xl bg-soft p-3 text-sm">{toArabicDigits(group.hint)}</p>}

            <ul className="mt-2 divide-y divide-line">
              {group.items
                .filter((item) => !activeDay || dayOfVerse(item.verse) === activeDay)
                .map((item) => (
                  <li key={item.verse} className="flex items-start gap-3 py-2">
                    <span className="mt-2 min-w-10 rounded-full bg-soft px-2 text-center text-sm font-semibold">
                      {toArabicDigits(item.verse)}
                    </span>
                    <span className="font-quran text-2xl leading-[2]">
                      <span className="text-muted">{item.before}</span> <span className="text-accent">{item.ending}</span>
                    </span>
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}
