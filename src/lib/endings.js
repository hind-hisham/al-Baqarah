// تجميع الآيات التي تنتهي بالفاصلة نفسها (آخر كلمتين).
import { TOTAL_VERSES, getVerse, dayOfVerse, verseRange } from '@/lib/verses';
import { splitWords, normalizeWord } from '@/lib/arabic';
import { ENDING_HINTS } from '@/data/endingHints';

const ENDING_WORDS = 2; // عدد الكلمات الأخيرة التي نعتبرها الفاصلة

// الناتج: مجموعات مرتبة من الأكثر تكرارا
// { key, ending, hint, days, items: [{ verse, before, ending }] }
export function buildEndingGroups() {
  const groups = new Map();

  for (const verse of verseRange(1, TOTAL_VERSES)) {
    const words = splitWords(getVerse(verse));
    const key = words.slice(-ENDING_WORDS).map(normalizeWord).join(' ');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({
      verse,
      before: words.slice(-(ENDING_WORDS + 6), -ENDING_WORDS).join(' '), // الكلمات التي قبل الفاصلة
      ending: words.slice(-ENDING_WORDS).join(' '),
    });
  }

  return [...groups.entries()]
    .filter(([, items]) => items.length >= 2)
    .map(([key, items]) => ({
      key,
      ending: items[0].ending,
      items,
      days: [...new Set(items.map((item) => dayOfVerse(item.verse)))],
      hint: ENDING_HINTS.find((h) => items.some((item) => item.verse === h.verse))?.hint ?? '',
    }))
    .sort((a, b) => b.items.length - a.items.length || a.items[0].verse - b.items[0].verse);
}

// أرقام كل الآيات التي تنتهي بفاصلة متكررة
export function verseNumbersWithRepeatedEnding() {
  return buildEndingGroups().flatMap((group) => group.items.map((item) => item.verse));
}
