'use client';

import { useEffect, useState } from 'react';

// يعمل مثل useState لكن القيمة تُحفظ في متصفح المستخدم وتعود عند فتح الموقع من جديد.
//
// الاستعمال:
//   const [done, setDone, loaded] = useLocalStorage(STORAGE_KEYS.daysDone, []);
//
// loaded تصبح true بعد قراءة القيمة المحفوظة. نستعملها لنتجنب عرض القيمة الافتراضية
// ثم تغييرها فجأة أمام المستخدم.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  // عند فتح الصفحة: اقرأ القيمة المحفوظة
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved));
    } catch {
      // إن كان التخزين محجوبا نكمل بالقيمة الافتراضية
    }
    setLoaded(true);
  }, [key]);

  // عند تغيّر القيمة: احفظها
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // تجاهل أخطاء التخزين (مثل الوضع الخاص أو امتلاء المساحة)
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}
