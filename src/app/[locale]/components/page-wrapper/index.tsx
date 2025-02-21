'use client';

import spindl from '@spindl-xyz/attribution';
import React, { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import Header from '../header';
import Sidebar from '../sidebar';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      spindl.attribute(address);
    }
  }, [address]);

  useEffect(() => {
    const updateSidebarWidth = () => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.offsetWidth);
      }
    };

    const observer = new MutationObserver(updateSidebarWidth);

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        attributeFilter: ['style', 'class'], // observe changes to style and class
      });
    }

    window.addEventListener('resize', updateSidebarWidth);
    updateSidebarWidth(); // Call once on mount to get the initial width

    return () => {
      window.removeEventListener('resize', updateSidebarWidth);
      observer.disconnect();
    };
  }, []);

  return (
    <div suppressHydrationWarning className="flex h-screen w-screen bg-[#141414] lg:overflow-hidden">
      <div className='border-r-2 border-black' ref={sidebarRef}>
        <Sidebar />
      </div>
      <div className="flex max-h-screen flex-grow flex-col" style={{ maxWidth: `calc(100% - ${sidebarWidth}px)` }}>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
