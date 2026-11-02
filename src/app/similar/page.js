import DayFilter from '@/components/DayFilter';
import VerseSearch from '@/components/VerseSearch';
import { SIMILAR_GROUPS } from '@/data/similar';
import { compareVerses } from '@/lib/diff';
import { dayOfVerse, getVerse } from '@/lib/verses';
import { firstWords, fromArabicDigits, lastWords, toArabicDigits } from '@/lib/arabic';

export const metadata = { title: 'المتشابهات | خريطة حفظ البقرة' };

// searchParams يأتي من الرابط: /similar?day=2&q=62
export default async function SimilarPage({ searchParams }) {
  const params = await searchParams;
  const activeDay = Number(params.day) || 0;
  const query = (params.q ?? '').toString().trim();
  const verseNumber = parseInt(fromArabicDigits(query), 10);

  const groups = SIMILAR_GROUPS.filter((group) => !activeDay || group.verses.some((n) => dayOfVerse(n) === activeDay)).filter(
    (group) => !query || group.verses.includes(verseNumber),
  );

  return (
    <>
      <h1 className="page-title">المتشابهات</h1>
      <p className="page-lead">
        آيات تتشابه ألفاظها داخل البقرة. الكلمات المظللة هي ما تنفرد به الآية عن أخواتها. تحت كل آية ما قبلها وما بعدها،
        وهما أقوى وسيلة للتمييز عندما تتطابق الآيتان. المقارنة هنا داخل السورة فقط.
      </p>

      <VerseSearch activeDay={activeDay} query={query} />
      <DayFilter basePath="/similar" activeDay={activeDay} query={query} />

      {groups.length === 0 && <p className="text-muted">لا توجد مجموعات مطابقة.</p>}

      <div className="space-y-4">
        {groups.map((group) => (
          <SimilarCard key={group.title} group={group} />
        ))}
      </div>
    </>
  );
}

function SimilarCard({ group }) {
  const members = compareVerses(group.verses);

  return (
    <article className="card">
      <h2 className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-quran text-2xl text-primary">{group.title}</span>
        <span className="text-sm text-muted">{toArabicDigits(group.verses.length)} مواضع</span>
      </h2>
      <p className="my-3 max-w-3xl rounded-xl bg-soft p-3 text-sm">{toArabicDigits(group.hint)}</p>

      <div className="divide-y divide-line">
        {members.map((member) => {
          const hasMore = member.from > 0 || member.to < member.words.length;
          return (
            <div key={member.verse} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 py-3">
              <span className="mt-2 h-fit min-w-10 rounded-full bg-soft px-2 text-center text-sm font-semibold">
                {toArabicDigits(member.verse)}
              </span>

              <div className="min-w-0">
                {/* الآية: الجزء المتشابه، وإن كانت طويلة تُفتح كاملة بـ <details> */}
                <p className="font-quran text-2xl leading-[2.1]">
                  {member.from > 0 && '… '}
                  <Words words={member.words.slice(member.from, member.to)} />
                  {member.to < member.words.length && ' …'}
                </p>
                {hasMore && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary underline">عرض الآية كاملة</summary>
                    <p className="mt-1 font-quran text-2xl leading-[2.1]">
                      <Words words={member.words} />
                    </p>
                  </details>
                )}

                {/* ما قبلها وما بعدها */}
                <p className="mt-1 flex flex-wrap gap-x-5 text-sm text-muted">
                  {member.verse > 1 && (
                    <span>
                      قبلها ﴿{toArabicDigits(member.verse - 1)}﴾{' '}
                      <span className="font-quran text-lg text-ink">… {lastWords(getVerse(member.verse - 1), 4)}</span>
                    </span>
                  )}
                  {member.verse < 286 && (
                    <span>
                      بعدها ﴿{toArabicDigits(member.verse + 1)}﴾{' '}
                      <span className="font-quran text-lg text-ink">{firstWords(getVerse(member.verse + 1), 4)} …</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

// يعرض الكلمات مع تظليل التي تنفرد بها الآية
function Words({ words }) {
  return words.map((word, i) => (
    <span key={i}>
      {word.shared ? word.text : <mark className="rounded bg-mark px-1 text-mark-ink">{word.text}</mark>}{' '}
    </span>
  ));
}
