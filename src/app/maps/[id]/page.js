import Link from 'next/link';
import { notFound } from 'next/navigation';
import MindMap from '@/components/MindMap';
import { MAPS } from '@/data/maps';
import { toArabicDigits } from '@/lib/arabic';

// نخبر Next.js بكل الصفحات الممكنة (master و 1 إلى 6) ليبنيها مسبقا
export function generateStaticParams() {
  return Object.keys(MAPS).map((id) => ({ id }));
}

// في Next 15 تأتي params كوعد (Promise) لذلك نستعمل await
export default async function MapPage({ params }) {
  const { id } = await params;
  if (!MAPS[id]) notFound();

  const tabs = Object.keys(MAPS);

  return (
    <>
      <h1 className="page-title">الخرائط الذهنية</h1>
      <p className="page-lead">
        كل خريطة تتفرع إلى موضوعات المقطع بترتيبها في المصحف. اضغط على فرع لتقرأ آياته، وفيها أول كلمتين من كل آية بلون
        أخضر وآخر ثلاث كلمات بلون ذهبي. أسفل كل فرع نقطة الانتقال إلى الفرع الذي بعده.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((key) => (
          <Link key={key} href={`/maps/${key}`} className={`chip ${key === id ? 'chip-active' : ''}`}>
            {key === 'master' ? 'الهيكل العام' : `اليوم ${toArabicDigits(key)}`}
          </Link>
        ))}
      </div>

      <MindMap mapKey={id} />
    </>
  );
}
