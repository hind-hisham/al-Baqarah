// منطق أسئلة صفحة «تدريب الربط». هذا الملف لا يعرف شيئا عن الواجهة.
import { DAYS } from '@/data/days';
import { SIMILAR_GROUPS } from '@/data/similar';
import { getVerse, TOTAL_VERSES, verseRange } from '@/lib/verses';
import { firstWords, lastWords, splitWords, toArabicDigits } from '@/lib/arabic';
import { verseNumbersWithRepeatedEnding } from '@/lib/endings';

// أنواع الأسئلة. لإضافة نوع جديد: أضفه هنا ثم في دالة makeQuestion.
export const MODES = [
  { id: 'next', label: 'بعد هذه الآية، ما بداية التي تليها؟' },
  { id: 'prev', label: 'هذه بداية آية، كيف انتهت التي قبلها؟' },
  { id: 'fasila', label: 'أكمل فاصلة الآية' },
];

// الآيات المتشابهة أو ذات الفاصلة المتكررة (لخيار «المتشابه فقط»)
export function similarVerseSet() {
  const set = new Set(verseNumbersWithRepeatedEnding());
  SIMILAR_GROUPS.forEach((group) => group.verses.forEach((n) => set.add(n)));
  return set;
}

// scope = 0 تعني السورة كاملة، وغير ذلك رقم اليوم
function scopeRange(scope) {
  if (!scope) return [1, TOTAL_VERSES];
  const day = DAYS.find((d) => d.id === scope);
  return [day.start, day.end];
}

// الآيات التي يمكن السؤال عنها حسب الإعدادات
// settings = { scope, mode, onlySimilar, onlyWeak }
export function buildPool(settings, weakList) {
  const [start, end] = scopeRange(settings.scope);
  const similar = settings.onlySimilar ? similarVerseSet() : null;

  return verseRange(start, end).filter((n) => {
    if (settings.mode === 'next' && n >= TOTAL_VERSES) return false; // لا آية بعد الأخيرة
    if (settings.mode === 'prev' && n <= 1) return false; // لا آية قبل الأولى
    if (settings.mode === 'fasila' && splitWords(getVerse(n)).length < 4) return false;
    if (similar && !similar.has(n)) return false;
    if (settings.onlyWeak && !weakList.includes(questionKey(settings.mode, n))) return false;
    return true;
  });
}

// مفتاح السؤال في قائمة «أحتاج تكرارا»
export function questionKey(mode, n) {
  return `${mode}:${n}`;
}

// يبني السؤال وجوابه. الناتج: { ask, prompt, answerLabel, answer }
export function makeQuestion(mode, n) {
  const num = toArabicDigits;

  if (mode === 'next') {
    return {
      ask: `الآية ${num(n)} تنتهي بـ`,
      prompt: `… ${lastWords(getVerse(n), 5)}`,
      answerLabel: `بداية الآية ${num(n + 1)}:`,
      answer: `${firstWords(getVerse(n + 1), 6)} …`,
    };
  }

  if (mode === 'prev') {
    return {
      ask: `الآية ${num(n)} تبدأ بـ`,
      prompt: `${firstWords(getVerse(n), 5)} …`,
      answerLabel: `نهاية الآية ${num(n - 1)}:`,
      answer: `… ${lastWords(getVerse(n - 1), 6)}`,
    };
  }

  // fasila: نخفي آخر كلمتين أو ثلاثا ونطلب إكمالها
  const words = splitWords(getVerse(n));
  const hidden = words.length >= 7 ? 3 : 2;
  const visible = words.slice(0, words.length - hidden).slice(-9);
  return {
    ask: `الآية ${num(n)}، أكمل الفاصلة`,
    prompt: `${words.length - hidden > 9 ? '… ' : ''}${visible.join(' ')} …`,
    answerLabel: 'الفاصلة:',
    answer: words.slice(-hidden).join(' '),
  };
}
