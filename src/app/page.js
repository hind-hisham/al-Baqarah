import PlanBoard from '@/components/PlanBoard';
import { ROUTINE, TECHNIQUES } from '@/data/routine';
import { toArabicDigits } from '@/lib/arabic';

// الصفحة الرئيسية: خطة الأسبوع.
// هذه الصفحة تعمل على الخادم، والجزء التفاعلي (PlanBoard) مكوّن منفصل يعمل في المتصفح.
export default function HomePage() {
  return (
    <>
      <h1 className="page-title">خريطة حفظ البقرة</h1>
      <p className="page-lead">
        السورة نحو ٦٠٠٠ كلمة. الخطة تقسمها على ست دفعات متقاربة الحجم عند حدود المعاني، ثم يوم أخير للمراجعة الشاملة.
        الحجم نحو ألف كلمة في اليوم، وهو كبير لكنه ممكن لمن يحفظ الآيات متفرقة وتنحصر مشكلته في الربط.
      </p>

      <PlanBoard />

      <h2 className="mb-3 mt-10 font-display text-3xl font-bold">برنامج اليوم الواحد</h2>
      <ol className="card space-y-4">
        {ROUTINE.map((step) => (
          <li key={step.title} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <span className="font-semibold text-primary">{step.title}</span>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 mt-10 font-display text-3xl font-bold">خمس قواعد للربط</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {TECHNIQUES.map((item, i) => (
          <div key={item.title} className="card">
            <h3 className="mb-1 font-display text-xl font-bold">
              <span className="text-accent">{toArabicDigits(i + 1)}.</span> {item.title}
            </h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-3xl rounded-xl bg-soft p-4 text-sm">
        التسميع على شخص يتقن الحفظ يكشف أخطاء لا تراها بنفسك، فإن أمكنك أن تسمّع على معلم أو صديق مرة كل يوم فافعل. الموقع
        يساعدك على التدريب ولا يغني عن مطابقة حفظك بالمصحف. ما تعلّمه هنا (الأيام المنجزة والآيات المحفوظة وقائمة التكرار)
        يُحفظ في متصفحك على هذا الجهاز فقط.
      </p>
    </>
  );
}
