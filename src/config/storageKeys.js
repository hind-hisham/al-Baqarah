// أسماء المفاتيح التي نحفظ بها بيانات المستخدم في متصفحه (localStorage).
// البيانات تبقى على جهازه فقط، ولا يوجد تسجيل دخول ولا خادم.
export const STORAGE_KEYS = {
  daysDone: 'bq-days-done', // مصفوفة من 7 قيم true/false
  memorized: 'bq-memorized', // أرقام الآيات التي علّمها المستخدم أنه حفظها
  weak: 'bq-weak', // أسئلة التدريب التي يحتاج تكرارها، مثل "next:62"
  practice: 'bq-practice', // آخر إعدادات صفحة التدريب
};
