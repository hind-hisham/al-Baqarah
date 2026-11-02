// مقارنة الآيات المتشابهة: نحدد الكلمات المشتركة بين الآيات، والباقي هو ما تنفرد به كل آية.
import { getVerse } from '@/lib/verses';
import { splitWords, normalizeWord } from '@/lib/arabic';

// يجد كل المقاطع المتطابقة (طولها كلمتان فأكثر) بين مصفوفتين من الكلمات.
// الطريقة: نبحث عن أطول مقطع مشترك، ثم نكرر البحث قبله وبعده.
function findCommonBlocks(a, b) {
  const blocks = [];

  function search(aStart, aEnd, bStart, bEnd) {
    if (aStart >= aEnd || bStart >= bEnd) return;

    let best = { aIndex: 0, bIndex: 0, size: 0 };
    let previousRow = new Array(bEnd + 1).fill(0);

    for (let i = aStart; i < aEnd; i++) {
      const row = new Array(bEnd + 1).fill(0);
      for (let j = bStart; j < bEnd; j++) {
        if (a[i] === b[j]) {
          row[j + 1] = previousRow[j] + 1;
          if (row[j + 1] > best.size) {
            best = { aIndex: i - row[j + 1] + 1, bIndex: j - row[j + 1] + 1, size: row[j + 1] };
          }
        }
      }
      previousRow = row;
    }

    if (best.size === 0) return;
    search(aStart, best.aIndex, bStart, best.bIndex);
    blocks.push(best);
    search(best.aIndex + best.size, aEnd, best.bIndex + best.size, bEnd);
  }

  search(0, a.length, 0, b.length);
  return blocks.filter((block) => block.size >= 2);
}

// الآيات الطويلة نعرض منها جزءا حول الموضع المشترك فقط
const SHORT_VERSE_WORDS = 24;
const CONTEXT_WORDS = 8;

// verseNumbers: أرقام آيات المجموعة
// الناتج لكل آية: { verse, words: [{ text, shared }], from, to }
//   shared = true  : الكلمة مشتركة مع آية أخرى
//   shared = false : الكلمة تنفرد بها هذه الآية (تُظلَّل في الصفحة)
//   from/to        : الجزء الذي يُعرض افتراضيا من الآية
export function compareVerses(verseNumbers) {
  return verseNumbers.map((verse) => {
    const words = splitWords(getVerse(verse));
    const normalized = words.map(normalizeWord);
    const sharedFlags = new Array(words.length).fill(false);

    for (const other of verseNumbers) {
      if (other === verse) continue;
      const otherNormalized = splitWords(getVerse(other)).map(normalizeWord);
      for (const block of findCommonBlocks(normalized, otherNormalized)) {
        for (let i = block.aIndex; i < block.aIndex + block.size; i++) sharedFlags[i] = true;
      }
    }

    const sharedIndexes = sharedFlags.flatMap((flag, i) => (flag ? [i] : []));
    let from = 0;
    let to = words.length;
    if (words.length > SHORT_VERSE_WORDS && sharedIndexes.length > 0) {
      from = Math.max(0, sharedIndexes[0] - CONTEXT_WORDS);
      to = Math.min(words.length, sharedIndexes[sharedIndexes.length - 1] + 1 + CONTEXT_WORDS);
    }

    return {
      verse,
      words: words.map((text, i) => ({ text, shared: sharedFlags[i] })),
      from,
      to,
    };
  });
}
