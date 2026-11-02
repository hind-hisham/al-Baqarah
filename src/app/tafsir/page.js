import Link from 'next/link';
import { DAYS } from '@/data/days';
import { toArabicDigits } from '@/lib/arabic';

export const metadata = { title: 'الشرح | خريطة حفظ البقرة' };

// فهرس الشرح: بطاقة لكل يوم تفتح صفحة آياته مع الشرح وأسباب النزول
export default function TafsirIndexPage() {
  return (
    <>
      <h1 className="page-title">شرح الآيات</h1>
      <p className="page-lead">
        شرح مبسّط لكل آية بأسلوب مختصر، يعين على فهم الآية وربطها بما قبلها. اختر اليوم لتقرأ آياته مع الشرح وأسباب النزول،
        وعلّم ما حفظته منها.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day) => (
          <Link key={day.id} href={`/tafsir/${day.id}`} className="card transition hover:border-primary">
            <p className="font-display text-2xl font-bold">اليوم {toArabicDigits(day.id)}</p>
            <p className="text-primary">
              {toArabicDigits(day.start)}–{toArabicDigits(day.end)}
            </p>
            <p className="mt-1 text-sm text-muted">{day.title}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 max-w-3xl rounded-xl bg-soft p-4 text-sm">
        الشرح هنا مختصر بصياغة مبسطة اعتمادا على ما اشتهر عند المفسرين، فإذا أردت التوسع أو التحقق فارجع إلى كتب التفسير
        المعتمدة مثل تفسير الطبري وابن كثير والسعدي.
      </p>
    </>
  );
}
