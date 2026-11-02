import { redirect } from 'next/navigation';

// /maps بلا رقم تعرض الخريطة العامة
export default function MapsIndexPage() {
  redirect('/maps/master');
}
