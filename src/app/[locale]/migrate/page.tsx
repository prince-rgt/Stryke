'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { cn } from '@/utils/styles';

import MigrationPanel from './components/migration-panel';

const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(100).fill(1);
  const cols = new Array(80).fill(1);
  let colors = [
    '#ACF9FF', // light-blue
    '#FF7092', // light-red
    '#86FFCC', // light-green
    '#F3FF6B', // light-stryke
    '#F83262', // red
    '#16EF94', // green
    '#43E6F2', // blue
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        'absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-[-8] ',
        className,
      )}
      {...rest}>
      {rows.map((_, i) => (
        <motion.div style={{ borderColor: 'hsl(0 0% 14.9%)' }} key={`row` + i} className="w-16 h-8 border-l relative">
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(${getRandomColor()})`,
                transition: { duration: 0 },
              }}
              style={{ borderColor: 'hsl(0 0% 14.9%)' }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t will-change-[background-color] relative">
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const Migrate: React.FC = () => {
  return (
    <div className="parallax-background overflow-scroll lg:overflow-hidden lg:h-[calc(100%-48px)] h-[600px] relative w-full z-10 flex flex-col justify-center items-center">
      <div className="absolute inset-0 w-full h-full bg-[url('/images/brand/bg-art.webp')] bg-no-repeat bg-center z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <BoxesCore />
      <Image src="/images/brand/stryke-logo-full.svg" width={90} height={23} alt="stryke-logo" className="mb-7" />
      <p className="text-xl font-bold text-muted-foreground mb-3">
        Migrate your
        <span className="text-foreground"> DPX </span> & <span className="text-foreground">rDPX </span> to
        <span className="text-highlight"> SYK</span>.
      </p>
      <p className="text-sm mb-4 w-[484px] text-center text-muted-foreground">
        It’s time to supercharge your old tokens. SYK Is a new exciting cross-chain token that powers Stryke’s future in
        cross-chain options.
      </p>
      <div className="w-[345px] h-96 flex flex-col space-y-[1px]">
        <MigrationPanel />
      </div>
    </div>
  );
};

export default Migrate;
