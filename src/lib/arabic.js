// دوال صغيرة للتعامل مع النص العربي.

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// 62 -> ٦٢
export function toArabicDigits(value) {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[d]);
}

// ٦٢ -> 62 (نستعملها لقراءة ما يكتبه المستخدم في خانة البحث)
export function fromArabicDigits(text) {
  return String(text).replace(/[٠-٩]/g, (d) => ARABIC_DIGITS.indexOf(d));
}

// نص الآية -> مصفوفة كلمات
export function splitWords(text) {
  return text.split(' ').filter(Boolean);
}

export function firstWords(text, count) {
  return splitWords(text).slice(0, count).join(' ');
}

export function lastWords(text, count) {
  const words = splitWords(text);
  return words.slice(Math.max(0, words.length - count)).join(' ');
}

// يزيل التشكيل ويوحّد أشكال الألف والياء، لنقارن الكلمات بدون اختلاف التشكيل
export function normalizeWord(word) {
  return word
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}
