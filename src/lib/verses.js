// الوصول إلى آيات السورة وأيام الخطة.
import verses from '@/data/verses.json';
import { DAYS } from '@/data/days';
import { splitWords } from '@/lib/arabic';

export const TOTAL_VERSES = verses.length; // 286

// نص الآية رقم n (الترقيم يبدأ من 1)
export function getVerse(n) {
  return verses[n - 1];
}

// أرقام الآيات من start إلى end
export function verseRange(start, end) {
  const numbers = [];
  for (let n = start; n <= end; n++) numbers.push(n);
  return numbers;
}

// رقم اليوم الذي تقع فيه الآية (0 إن لم توجد)
export function dayOfVerse(n) {
  const day = DAYS.find((d) => n >= d.start && n <= d.end);
  return day ? day.id : 0;
}

export function getDay(id) {
  return DAYS.find((d) => d.id === Number(id));
}

// عدد كلمات يوم كامل
export function countWords(start, end) {
  return verseRange(start, end).reduce((sum, n) => sum + splitWords(getVerse(n)).length, 0);
}
