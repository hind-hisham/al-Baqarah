'use client';

import Link from 'next/link';
import { DAYS } from '@/data/days';
import { useLocalStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { toArabicDigits } from '@/lib/arabic';
import { TOTAL_VERSES, countWords } from '@/lib/verses';

const TOTAL_DAYS = DAYS.length + 1; // ستة أيام حفظ + يوم مراجعة

// لوحة الأيام: بطاقة لكل يوم مع خانة «أتممت اليوم»، وشريط تقدم، وعدّاد الآيات المحفوظة.
// ما يعلّمه المستخدم يُحفظ في متصفحه.
export default function PlanBoard() {
  const [daysDone, setDaysDone] = useLocalStorage(STORAGE_KEYS.daysDone, []);
  const [memorized] = useLocalStorage(STORAGE_KEYS.memorized, []);

  function toggleDay(id) {
    setDaysDone(daysDone.includes(id) ? daysDone.filter((d) => d !== id) : [...daysDone, id]);
  }

  const percent = (daysDone.length / TOTAL_DAYS) * 100;

  return (
    <div>
      {/* التقدم */}
      <div className="card mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm text-muted">
            الأيام المنجزة: <b className="text-ink">{toArabicDigits(daysDone.length)}</b> من {toArabicDigits(TOTAL_DAYS)}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-soft">
            <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted">
            الآيات المحفوظة: <b className="text-ink">{toArabicDigits(memorized.length)}</b> من {toArabicDigits(TOTAL_VERSES)}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-soft">
            <div className="h-full bg-accent transition-all" style={{ width: `${(memorized.length / TOTAL_VERSES) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* بطاقات الأيام */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day) => (
          <DayCard
            key={day.id}
            title={`اليوم ${toArabicDigits(day.id)}`}
            range={`${toArabicDigits(day.start)}–${toArabicDigits(day.end)}`}
            description={day.title}
            details={`${toArabicDigits(day.end - day.start + 1)} آية · ${toArabicDigits(countWords(day.start, day.end))} كلمة`}
            done={daysDone.includes(day.id)}
            onToggle={() => toggleDay(day.id)}
            links={[
              { href: `/maps/${day.id}`, label: 'الخريطة' },
              { href: `/tafsir/${day.id}`, label: 'الشرح' },
              { href: '/practice', label: 'تدريب' },
            ]}
          />
        ))}
        <DayCard
          title="اليوم ٧"
          range="١–٢٨٦"
          description="مراجعة شاملة ومتشابهات"
          details="سمّع السورة في جلستين: الصباح من ١ إلى ١٧٧، والمساء من ١٧٨ إلى ٢٨٦. ثم خصص ساعة للمتشابهات والفواصل."
          done={daysDone.includes(7)}
          onToggle={() => toggleDay(7)}
          links={[
            { href: '/maps/master', label: 'الهيكل العام' },
            { href: '/similar', label: 'المتشابهات' },
            { href: '/endings', label: 'الفواصل' },
          ]}
        />
      </div>
    </div>
  );
}

// بطاقة يوم واحد
function DayCard({ title, range, description, details, done, onToggle, links }) {
  return (
    <article className={`card flex flex-col gap-2 ${done ? 'border-ok' : ''}`}>
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <span className="font-semibold text-primary">{range}</span>
      </header>
      <p className="text-sm text-muted">{description}</p>
      <p className="text-sm text-muted">{details}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="btn text-sm">
            {link.label}
          </Link>
        ))}
      </div>
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={done} onChange={onToggle} className="h-5 w-5 accent-[var(--primary)]" />
        أتممت اليوم
      </label>
    </article>
  );
}
