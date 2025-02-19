'use client';

import { BUILD_APP_NAMES } from '@/types';

import { DoubleArrowLeftIcon, DoubleArrowRightIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useToggle } from 'react-use';

import { cn } from '@/utils/styles';

import { Link, usePathname } from '@/navigation';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import useScreen from '../../hooks/useScreen';

import { BUILD_APP_NAME } from '@/consts/env';
import { LOGO_CLICK_HREF, SIDEBAR_ITEMS } from './consts';

import Logo from '../logo';
import TextLogo from '../logo/text';

const OVERRIDE_HIDDEN = {
  [BUILD_APP_NAMES.STRYKE]: false,
  [BUILD_APP_NAMES.KODIAK]: false,
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: false,
  [BUILD_APP_NAMES.PANCAKESWAP]: true,
};

const Sidebar = () => {
  const t = useTranslations('Sidebar');
  const [isCollapsed, toggle] = useToggle(true);
  const { isMobile } = useScreen();

  const pathname = usePathname();

  if (OVERRIDE_HIDDEN[BUILD_APP_NAME]) return null;

  return isMobile ? null : (
    <div
      className={cn(
        'z-20 flex h-full flex-col justify-between bg-primary p-md pb-4 transition-all duration-500 ease-in-out',
      )}>
      {isCollapsed ? (
        <div className="flex flex-col space-y-4">
          <Link href={LOGO_CLICK_HREF}>
            <Logo className="cursor-pointer hover:-rotate-6" />
          </Link>
          <Button variant={'ghost'} size={'md'} onClick={toggle}>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
          {SIDEBAR_ITEMS.map(({ Icon, label, href }) => {
            return (
              <Link key={label} href={`${href}`}>
                <Button
                  key={label}
                  className={cn(
                    // handle dashboard active state
                    `${
                      (href === '/' && pathname === '/') || (href !== '/' && pathname.endsWith(href))
                        ? 'bg-secondary'
                        : ''
                    }`,
                  )}
                  variant={'ghost'}
                  size={'md'}>
                  <Icon className="h-4 w-4" />
                </Button>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <Link href={LOGO_CLICK_HREF}>
            <div className="logo-container group mb-4 flex cursor-pointer items-center justify-start">
              <Logo className="transform transition duration-300 ease-in-out group-hover:-rotate-6" />
              <TextLogo className="ml-4" />
            </div>
          </Link>
          <Button variant={'ghost'} size={'md'} onClick={toggle}>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="mt-4 flex flex-1 flex-col items-center justify-between">
            <div className="flex flex-col items-center justify-start space-y-4">
              {SIDEBAR_ITEMS.map(({ Icon, label, href }) => (
                <Link key={label} href={`${href}`}>
                  <Button
                    key={label}
                    className={cn(
                      'flex w-[225px] items-center justify-start',
                      `${
                        (href === '/' && pathname === '/') || (href !== '/' && pathname.endsWith(href))
                          ? 'bg-secondary'
                          : ''
                      }`,
                    )}
                    variant={'ghost'}
                    size={'md'}>
                    <Icon className="h-4 w-4" />
                    <Typography className="ml-md" variant="small-medium">
                      {t(label)}
                    </Typography>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="flex w-full flex-col space-y-4">
              <NextLink
                href="/changelog"
                target="_blank"
                className="flex items-center space-x-1 pl-1 text-muted-foreground hover:underline">
                <Typography>Changelog</Typography>
                <OpenInNewWindowIcon className="h-4 w-4" />
              </NextLink>
              <div className="flex space-x-2">
                <Button
                  className="flex w-1/2 items-center justify-between bg-x-logo pl-2 hover:opacity-80"
                  variant={'ghost'}
                  onClick={() => {
                    window.open('https://x.com/stryke_xyz', '_blank');
                  }}
                  size={'sm'}>
                  <Typography variant="small-medium">X</Typography>
                  <OpenInNewWindowIcon className="h-4 w-4" />
                </Button>
                <Button
                  className="flex w-1/2 items-center justify-between bg-discord-logo hover:opacity-80"
                  variant={'ghost'}
                  size={'sm'}
                  onClick={() => {
                    window.open('https://discord.gg/stryke', '_blank');
                  }}>
                  <Typography variant="small-medium">Discord</Typography>
                  <OpenInNewWindowIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
