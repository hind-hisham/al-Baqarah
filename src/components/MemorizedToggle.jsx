'use client';

import { useLocalStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/config/storageKeys';

// زر «حفظتها» تحت كل آية. الحالة محفوظة في متصفح المستخدم.
export default function MemorizedToggle({ verse }) {
  const [memorized, setMemorized] = useLocalStorage(STORAGE_KEYS.memorized, []);
  const isMemorized = memorized.includes(verse);

  function toggle() {
    setMemorized(isMemorized ? memorized.filter((n) => n !== verse) : [...memorized, verse]);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isMemorized}
      className={`btn text-sm ${isMemorized ? 'border-ok text-ok' : ''}`}
    >
      {isMemorized ? '✓ حفظتها' : 'علّمها كمحفوظة'}
    </button>
  );
}
