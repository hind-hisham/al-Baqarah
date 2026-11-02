import Practice from '@/components/Practice';

export const metadata = { title: 'تدريب الربط | خريطة حفظ البقرة' };

export default function PracticePage() {
  return (
    <>
      <h1 className="page-title">تدريب الربط</h1>
      <p className="page-lead">
        هنا تتدرب على ما يتعثر فيه الحفظ فعلا: الانتقال من آية إلى التي بعدها، والفاصلة التي تنتهي بها الآية. حاول أن تجيب
        بصوت عال قبل أن تكشف الجواب، ثم قيّم نفسك بصدق.
      </p>
      <Practice />
    </>
  );
}
