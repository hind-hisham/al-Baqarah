'use client';

import { useEffect, useState } from 'react';
import { DAYS } from '@/data/days';
import { MODES, buildPool, makeQuestion, questionKey } from '@/lib/drill';
import { useLocalStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { toArabicDigits } from '@/lib/arabic';

const DEFAULT_SETTINGS = { scope: 0, mode: 'next', onlySimilar: false, onlyWeak: false };

// صفحة التدريب: سؤال عشوائي، تحاول الإجابة، تكشف الجواب، ثم تقيّم نفسك.
// الإعدادات وقائمة «أحتاج تكرارا» محفوظة في المتصفح.
export default function Practice() {
  const [settings, setSettings, settingsLoaded] = useLocalStorage(STORAGE_KEYS.practice, DEFAULT_SETTINGS);
  const [weak, setWeak, weakLoaded] = useLocalStorage(STORAGE_KEYS.weak, []);
  const [current, setCurrent] = useState(null); // رقم الآية المسؤول عنها
  const [revealed, setRevealed] = useState(false);

  const pool = buildPool(settings, weak);

  // اختيار آية عشوائية جديدة
  function pickNext() {
    if (pool.length === 0) {
      setCurrent(null);
      return;
    }
    let choice = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && choice === current) choice = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(choice);
    setRevealed(false);
  }

  // أول سؤال بعد تحميل الإعدادات، وسؤال جديد كلما تغيّرت الإعدادات
  useEffect(() => {
    if (settingsLoaded && weakLoaded) pickNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsLoaded, weakLoaded, settings.scope, settings.mode, settings.onlySimilar, settings.onlyWeak]);

  function update(changes) {
    setSettings({ ...settings, ...changes });
  }

  // تقييم المستخدم لنفسه
  function grade(knewIt) {
    const key = questionKey(settings.mode, current);
    if (knewIt) setWeak(weak.filter((k) => k !== key));
    else if (!weak.includes(key)) setWeak([...weak, key]);
    pickNext();
  }

  const question = current ? makeQuestion(settings.mode, current) : null;

  return (
    <div className="grid items-start gap-5 md:grid-cols-[320px_1fr]">
      {/* لوحة الإعدادات */}
      <section className="card flex flex-col gap-4" aria-label="الإعدادات">
        <label className="flex flex-col gap-1 font-semibold">
          النطاق
          <select
            value={settings.scope}
            onChange={(e) => update({ scope: Number(e.target.value) })}
            className="rounded-xl border border-line bg-card px-3 py-2 font-normal"
          >
            <option value={0}>السورة كاملة</option>
            {DAYS.map((day) => (
              <option key={day.id} value={day.id}>
                اليوم {toArabicDigits(day.id)} ({toArabicDigits(day.start)}–{toArabicDigits(day.end)})
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold">نوع السؤال</legend>
          {MODES.map((mode) => (
            <label key={mode.id} className="flex cursor-pointer items-start gap-2">
              <input
                type="radio"
                name="mode"
                checked={settings.mode === mode.id}
                onChange={() => update({ mode: mode.id })}
                className="mt-1.5 h-4 w-4 accent-[var(--primary)]"
              />
              {mode.label}
            </label>
          ))}
        </fieldset>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.onlySimilar}
            onChange={(e) => update({ onlySimilar: e.target.checked })}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          المتشابه والمتكرر فقط
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.onlyWeak}
            onChange={(e) => update({ onlyWeak: e.target.checked })}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          ما أحتاج تكراره فقط
        </label>
        <button type="button" onClick={() => setWeak([])} className="btn text-sm">
          مسح قائمة التكرار
        </button>
      </section>

      {/* بطاقة السؤال */}
      <section className="card flex min-h-[340px] flex-col justify-center gap-4" aria-live="polite">
        {!question ? (
          <p className="text-muted">لا توجد أسئلة بهذه الخيارات. أزل بعض المرشحات أو غيّر النطاق.</p>
        ) : (
          <>
            <p className="text-muted">{question.ask}</p>
            <p className="font-quran text-3xl leading-[2.1]">{question.prompt}</p>

            {revealed ? (
              <>
                <div className="border-t border-dashed border-line pt-4">
                  <p className="text-muted">{question.answerLabel}</p>
                  <p className="font-quran text-3xl leading-[2.1] text-primary">{question.answer}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => grade(true)} className="btn border-ok text-ok">
                    عرفتها
                  </button>
                  <button type="button" onClick={() => grade(false)} className="btn border-warn text-warn">
                    أحتاج تكرارا
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setRevealed(true)} className="btn btn-primary">
                  اكشف الجواب
                </button>
                <button type="button" onClick={pickNext} className="btn">
                  تخطَّ
                </button>
              </div>
            )}
          </>
        )}

        <p className="text-sm text-muted">
          أسئلة في النطاق: <b className="text-ink">{toArabicDigits(pool.length)}</b> · تحتاج تكرارا:{' '}
          <b className="text-ink">{toArabicDigits(weak.length)}</b>
        </p>
      </section>
    </div>
  );
}
