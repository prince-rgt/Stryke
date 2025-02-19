'use client';

import { useTranslations } from 'next-intl';

import useScreen from '../../hooks/useScreen';

import HeaderDesktop from './header-desktop';
import HeaderMobile from './header-mobile';

const Header = () => {
  const t = useTranslations('Header');
  const { isMobile } = useScreen();

  return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
};

export default Header;
