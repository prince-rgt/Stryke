import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useToggle } from 'react-use';

import { Link } from '@/navigation';

import StrykeLogo from '@/components/icons/stryke-logo';
import StrykeTextLogo from '@/components/icons/stryke-text-logo';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { SIDEBAR_ITEMS } from '../sidebar/consts';

const HeaderMobile = () => {
  const t = useTranslations('Sidebar');
  const [isOpen, toggle] = useToggle(false);

  return (
    <>
      <div className="flex items-center justify-between bg-primary p-md">
        <div className="flex items-center">
          <StrykeLogo />
          <StrykeTextLogo className="ml-md" />
        </div>
        <Button variant={'ghost'} size={'md'} onClick={toggle}>
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-primary p-md">
          <div className="mb-md flex items-center justify-between">
            <div className="flex items-center">
              <StrykeLogo />
              <StrykeTextLogo className="ml-md" />
            </div>
            <Button variant={'ghost'} size={'md'} onClick={toggle}>
              <Cross1Icon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            {SIDEBAR_ITEMS.map(({ Icon, label, href }) => (
              <Link key={label} href={`${href}`}>
                <Button key={label} className="flex w-full items-center justify-start" variant={'ghost'} size={'md'}>
                  <Icon className="h-4 w-4" />
                  <Typography className="ml-md" variant="small-medium">
                    {t(label)}
                  </Typography>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderMobile;
