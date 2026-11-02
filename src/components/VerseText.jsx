import { getVerse } from '@/lib/verses';
import { splitWords, toArabicDigits } from '@/lib/arabic';

// يعرض الآية بخط المصحف مع تلوين:
//   أول كلمتين بلون أخضر (بداية الآية)، وآخر ثلاث كلمات بلون ذهبي (نهاية الآية).
// هذا التلوين يدرّب العين على بدايات الآيات ونهاياتها.
export default function VerseText({ number }) {
  const words = splitWords(getVerse(number));
  const last = words.length;

  return (
    <span>
      {words.map((word, i) => {
        let color = '';
        if (i >= last - 3 && i >= 2) color = 'text-accent';
        else if (i < 2) color = 'text-primary';
        return (
          <span key={i} className={color}>
            {word}{' '}
          </span>
        );
      })}
      <span className="whitespace-nowrap text-[0.75em] text-muted">﴿{toArabicDigits(number)}﴾</span>
    </span>
  );
}
