'use client';

import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className="cursor-pointer">
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 p-3 font-semibold text-sm bg-white text-black text-xs rounded shadow-lg -top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
