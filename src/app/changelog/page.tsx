import { Dot } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import StrykeLogo from '@/components/icons/stryke-logo';
import { Timeline } from '@/components/ui/timeline';

import CHANGELOG_DATA from './consts/changelog';
import NAV_ITEMS from './consts/nav-items';

export default function Changelog() {
  return (
    <div className="w-full bg-background font-open_sans">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <h2 className="items mb-4 flex max-w-4xl space-x-3 text-lg text-foreground md:text-4xl">
          <StrykeLogo />
          <span>Changelog</span>
        </h2>
        <p className="mb-2 max-w-sm text-sm text-muted-foreground md:text-base">
          New updates and improvements to Stryke
        </p>
        <div className="flex space-x-0">
          {NAV_ITEMS.map((item, index) => {
            return (
              <div key={item.name} className="flex items-center">
                <Link href={item.url} target="_blank">
                  <p className="text-accent">{item.name}</p>
                </Link>
                {index < NAV_ITEMS.length - 1 ? <Dot className="mx-2 h-2 w-2 text-foreground" /> : null}
              </div>
            );
          })}
        </div>
      </div>
      <Timeline data={CHANGELOG_DATA} />
    </div>
  );
}
