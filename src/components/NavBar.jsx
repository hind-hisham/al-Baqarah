'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/config/nav';

// الشريط العلوي. يحتاج 'use client' لأنه يقرأ المسار الحالي ليلوّن الرابط النشط.
export default function NavBar() {
  const pathname = usePathname();

  // الرابط نشط إذا كان المسار نفسه أو صفحة داخلية منه (مثل /maps/3)
  function isActive(href) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2">
        <Link href="/" className="shrink-0 font-display text-2xl font-bold text-primary">
          حفظ البقرة
        </Link>
        <ul className="flex gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(link.href) ? 'bg-primary text-on-primary' : 'text-muted hover:bg-soft hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
