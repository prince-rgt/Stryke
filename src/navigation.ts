import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { localePrefix, locales } from './i18n/request';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
});
