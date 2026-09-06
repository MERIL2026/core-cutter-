'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !pathname.startsWith('/api')) {
      trackEvent({
        event_name: 'page_view',
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
