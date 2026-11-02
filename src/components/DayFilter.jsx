import Link from 'next/link';
import { DAYS } from '@/data/days';
import { toArabicDigits } from '@/lib/arabic';

// أزرار تصفية حسب اليوم. كل زر رابط عادي إلى نفس الصفحة مع ?day=2
// لذلك لا يحتاج جافاسكربت في المتصفح.
export default function DayFilter({ basePath, activeDay, query }) {
  function hrefFor(day) {
    const params = new URLSearchParams();
    if (day) params.set('day', day);
    if (query) params.set('q', query);
    const text = params.toString();
    return text ? `${basePath}?${text}` : basePath;
  }

  const items = [{ id: 0, label: 'الكل' }, ...DAYS.map((d) => ({ id: d.id, label: `اليوم ${toArabicDigits(d.id)}` }))];

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={hrefFor(item.id)}
          className={`chip ${activeDay === item.id ? 'chip-active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
