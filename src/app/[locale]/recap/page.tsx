'use client';

import confetti from 'canvas-confetti';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Award, Calendar, Download, Rocket, Share2, Sparkles, TrendingUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import StrykeLogo from '@/components/icons/stryke-logo';

import { STRYKE_COLORS } from '@/styles/themes/consts';

import { fetchAndAggregateUserRecapData } from './fetchData';

const MARKET_NAMES: Record<string, string> = {
  '0xe9e1310d3e6401dfa1f5a3544cc6b0fced68c189': 'BOOP-WETH',
  '0x501b03bdb431154b8df17bf1c00756e3a8f21744': 'WETH-USDC',
  '0x4eed3a2b797bf5630517ecce2e31c1438a76bb92': 'ARB-USDC',
  '0x550e7e236912daa302f7d5d0d6e5d7b6ef191f04': 'WBTC-USDC',
  '0x764fa09d0b3de61eed242099bd9352c1c61d3d27': 'WETH-USDC.e',
  '0x77b6f45a3dcf0493f1b9ac9874e5982ab526aa9e': 'ARB-USDC.e',
  '0x3808e8c983023a125ffe2714e2a703a3bf02be0d': 'WBTC-USDC.e',
  '0x1d5de630bbbf68c9bf17d8462605227d79ea910c': 'WMNT-USDT',
  '0xcda890c42365dcb1a8a1079f2f47379ad620bc99': 'WETH-USDT',
  '0x10f95fa355f2c2c44afa975b784ff88443fe21dc': 'DEGEN-WETH',
  '0x849f74700b0714c6b87680f7af49b72677298d86': 'BRETT-WETH',
  '0x40211ac3637f342c964b4a1a24b3e997f217e8da': 'BLAST-USDB',
};

const getFriendlyMarketName = (address: string): string => {
  const normalized = address.toLowerCase();
  return MARKET_NAMES[normalized] || 'Unknown Market';
};

// Enhanced background pattern component
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-30">
    <div className="absolute w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-pan-pattern" />
  </div>
);

// Glowing orb effect component
const GlowingOrb = ({ color }: { color: string }) => (
  <div
    className="absolute -z-10 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-slow"
    style={{
      background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
    }}
  />
);

// Core data types
export type RecapData = {
  userAddress: string;
  uniqueDaysTraded: number;
  lifetimeVolume: string;
  lifetimePnl: string;
  biggestProfitUSD: number;
  totalSpentToken: number;
  favoriteMarket: string;
};

const COLORS = {
  ...STRYKE_COLORS,
  // Additional vibrant colors for accents
  'vibrant-purple': 'hsl(265, 89%, 78%)',
  'vibrant-blue': 'hsl(200, 100%, 75%)',
  'vibrant-pink': 'hsl(330, 100%, 71%)',
  'neon-yellow': 'hsl(65, 100%, 75%)',
  // Enhanced greys for better contrast
  'enhanced-grey': 'hsl(0 0% 65%)',
  'bright-grey': 'hsl(0 0% 85%)',
} as const;

const confettiConfig = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: [
    COLORS['neon-yellow'],
    COLORS['vibrant-purple'],
    COLORS['vibrant-blue'],
    COLORS['vibrant-pink'],
    COLORS['light-stryke'],
  ],
};

// Types
type SlideConfig = {
  icon: React.ReactNode;
  title: React.ReactNode;
  content: (data: RecapData) => React.ReactNode;
  showConfetti?: boolean;
};

// Animated number component
const CountUpAnimation: React.FC<{
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ value, duration = 2000, className = '', prefix = '', decimals = 0, style }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimationControls();

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayValue(progress * value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
    void controls.start({ opacity: 1, y: 0 });
  }, [value, duration, controls]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={controls} className={className} style={style}>
      {prefix}
      {displayValue.toFixed(decimals)}
    </motion.div>
  );
};

const buttonStyles = {
  default: {
    background: COLORS['dark-grey'],
    color: COLORS['bright-grey'],
    hover: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: COLORS['light-stryke'],
    },
  },
  highlight: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: COLORS['neon-yellow'],
    hover: {
      background: 'rgba(255, 255, 255, 0.15)',
    },
  },
};

const RecapPage: React.FC = () => {
  const { address } = useAccount();
  const [recapData, setRecapData] = useState<RecapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  async function fetchRecapData(userWallet?: string): Promise<void> {
    if (!userWallet) return;
    setLoading(true);
    try {
      const data = await fetchAndAggregateUserRecapData(userWallet);
      setRecapData(data);
    } catch (err) {
      console.error('Error fetching recap data:', err);
      setRecapData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (address) {
      void fetchRecapData(address.toLocaleLowerCase()!);
    } else {
      setRecapData(null);
    }
  }, [address]);

  const downloadRecap = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        backgroundColor: STRYKE_COLORS['primary-panel'],
      });

      const link = document.createElement('a');
      link.download = 'stryke-recap-2024.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading recap:', err);
    }
  };

  const triggerConfetti = () => {
    confetti(confettiConfig);
  };

  const slides: SlideConfig[] = [
    {
      icon: <Sparkles className="w-12 h-12" style={{ color: COLORS['neon-yellow'] }} />,
      title: '2024 Stryke Wrapped',
      content: ({ userAddress }) => (
        <div className="space-y-4">
          <p className="text-lg" style={{ color: COLORS['bright-grey'] }}>
            Your year of trading on Stryke
          </p>
          <p className="text-sm font-mono" style={{ color: COLORS['enhanced-grey'] }}>
            {userAddress}
          </p>
        </div>
      ),
    },
    {
      icon: <Calendar className="w-12 h-12" style={{ color: COLORS['vibrant-blue'] }} />,
      title: 'Trading Activity',
      content: ({ uniqueDaysTraded }) => (
        <div className="space-y-4 translate-x-2">
          <CountUpAnimation
            value={uniqueDaysTraded}
            className="text-7xl font-bold"
            style={{ color: COLORS['vibrant-blue'] }}
          />
          <p className="text-xl" style={{ color: COLORS['bright-grey'] }}>
            Days Active
          </p>
          <p className="text-sm" style={{ color: COLORS['enhanced-grey'] }}>
            That&apos;s {Math.round((uniqueDaysTraded / 365) * 100)}% of the year!
          </p>
        </div>
      ),
    },
    {
      icon: <TrendingUp className="w-12 h-12" style={{ color: COLORS['light-green'] }} />,
      title: 'Volume & Performance',
      content: ({ lifetimeVolume, lifetimePnl }) => (
        <div className="space-y-8">
          <div>
            <p className="text-sm" style={{ color: COLORS['bright-grey'] }}>
              Total Volume
            </p>
            <p className="text-4xl font-bold" style={{ color: COLORS['vibrant-blue'] }}>
              {lifetimeVolume}
            </p>
          </div>
          <div>
            <p className="text-sm" style={{ color: COLORS['bright-grey'] }}>
              Total PnL
            </p>
            <p
              className="text-4xl font-bold"
              style={lifetimePnl.includes('-') ? { color: COLORS['light-red'] } : { color: COLORS['light-green'] }}>
              {lifetimePnl}
            </p>
          </div>
        </div>
      ),
      showConfetti: true,
    },
    {
      icon: <Award className="w-12 h-12" style={{ color: COLORS['vibrant-pink'] }} />,
      title: 'Biggest Win',
      content: ({ biggestProfitUSD }) => (
        <div className="space-y-4">
          <CountUpAnimation
            value={biggestProfitUSD}
            decimals={2}
            prefix="$"
            className="text-6xl font-bold"
            style={{ color: COLORS['light-green'] }}
          />
          <p className="text-lg" style={{ color: COLORS['bright-grey'] }}>
            Your most profitable trade
          </p>
        </div>
      ),
      showConfetti: true,
    },
    {
      icon: <Rocket className="w-12 h-12" style={{ color: COLORS['vibrant-purple'] }} />,
      title: 'Favorite Market',
      content: ({ favoriteMarket }) => (
        <div className="space-y-4">
          <p className="text-3xl font-bold" style={{ color: COLORS['vibrant-blue'] }}>
            {getFriendlyMarketName(favoriteMarket)}
          </p>

          <p className="text-lg" style={{ color: COLORS['bright-grey'] }}>
            Your most traded market
          </p>
        </div>
      ),
    },
    {
      icon: <Share2 className="w-12 h-12" style={{ color: COLORS['neon-yellow'] }} />,
      title: (
        <div className="flex items-center">
          <StrykeLogo className="mr-1" /> <p>Year in Review</p>
        </div>
      ),
      content: (data) => (
        <div className="grid grid-cols-2 gap-6 -translate-x-1">
          <div>
            <p className="text-sm mb-1" style={{ color: COLORS['bright-grey'] }}>
              Days Traded
            </p>
            <p className="text-2xl font-bold" style={{ color: COLORS['vibrant-blue'] }}>
              {data.uniqueDaysTraded}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: COLORS['bright-grey'] }}>
              Volume
            </p>
            <p className="text-2xl font-bold" style={{ color: COLORS['vibrant-blue'] }}>
              {data.lifetimeVolume}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: COLORS['bright-grey'] }}>
              Best Trade
            </p>
            <p className="text-2xl font-bold" style={{ color: COLORS['light-green'] }}>
              ${data.biggestProfitUSD.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: COLORS['bright-grey'] }}>
              Total PnL
            </p>
            <p
              className="text-2xl font-bold"
              style={
                data.lifetimePnl.includes('-') ? { color: COLORS['light-red'] } : { color: COLORS['light-green'] }
              }>
              {data.lifetimePnl}
            </p>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (slides[currentSlide]?.showConfetti) {
      triggerConfetti();
    }
  }, [currentSlide, slides]);

  if (!address) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: STRYKE_COLORS['primary-panel'] }}>
        <div className="text-center space-y-4">
          <p style={{ color: 'white' }}> Connect Your Wallet to see your 2024 trading wrapped</p>
        </div>
      </div>
    );
  }

  if (loading || !recapData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: STRYKE_COLORS['primary-panel'] }}>
        <div className="text-center space-y-4">
          <div
            className="animate-spin w-12 h-12 border-4 rounded mx-auto"
            style={{
              borderColor: STRYKE_COLORS['light-stryke'],
              borderTopColor: 'transparent',
            }}
          />
          <p style={{ color: 'white' }}>Loading your recap...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center p-4 relative py-1"
      style={{ background: COLORS['primary-panel'] }}>
      {/* Animated background elements */}
      <div className="absoulte inset-0 opacity-50">
        <div className="absolute top-0 left-0">
          <GlowingOrb color={COLORS['neon-yellow']} />
        </div>
        <div className="absolute bottom-0 right-0">
          <GlowingOrb color={COLORS['vibrant-blue']} />
        </div>
      </div>
      <BackgroundPattern />

      <div className="w-full max-w-lg relative z-10">
        {/* Main content card with glassmorphism */}
        <div
          ref={cardRef}
          className="relative aspect-[4/3] rounded-xl overflow-hidden mb-8 backdrop-blur-md shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.9), rgba(30, 30, 30, 0.8))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
          {/* Card inner glow */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 70%)',
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{
                duration: 0.4,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              className="absolute inset-0 p-8">
              {/* Animated icon with glow effect */}
              <motion.div
                className="absolute top-4 right-4"
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                }}>
                <div className="relative">
                  {slides[currentSlide].icon}
                  <div className="absolute inset-0 blur-lg opacity-50" style={{ transform: 'scale(1.2)' }}>
                    {slides[currentSlide].icon}
                  </div>
                </div>
              </motion.div>

              <div className="h-full flex flex-col">
                {/* Enhanced title with gradient text */}
                <h2
                  className="text-2xl font-bold mb-6 tracking-tight"
                  style={{
                    background: `linear-gradient(to right, ${COLORS['neon-yellow']}, ${COLORS['vibrant-blue']})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  {slides[currentSlide].title}
                </h2>

                {/* Dynamic content with enhanced styling */}
                <div className="flex-1 flex items-center justify-center relative">
                  {/* Content background glow */}
                  <div
                    className="absolute inset-0 blur-xl opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${COLORS['neon-yellow']}20, transparent 70%)`,
                    }}
                  />
                  {slides[currentSlide].content(recapData)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced navigation with glassmorphism */}
        <div
          className="flex justify-between items-center backdrop-blur-sm rounded-xl p-4"
          style={{
            background: 'rgba(20, 20, 20, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)}
              disabled={currentSlide === 0}
              className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 
                       disabled:cursor-not-allowed transition-all relative group"
              style={{
                background: 'linear-gradient(145deg, rgba(40, 40, 40, 0.8), rgba(30, 30, 30, 0.8))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
              <span style={{ color: COLORS['bright-grey'] }}>Prev</span>
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(145deg, ${COLORS['neon-yellow']}10, transparent)`,
                }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => currentSlide < slides.length - 1 && setCurrentSlide(currentSlide + 1)}
              disabled={currentSlide === slides.length - 1}
              className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 
                       disabled:cursor-not-allowed transition-all relative group"
              style={{
                background: 'linear-gradient(145deg, rgba(40, 40, 40, 0.8), rgba(30, 30, 30, 0.8))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
              <span style={{ color: COLORS['bright-grey'] }}>Next</span>
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(145deg, ${COLORS['neon-yellow']}10, transparent)`,
                }}
              />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // ref={downloadButtonRef}
            onClick={downloadRecap}
            className="flex items-center gap-2 px-6 py-2 rounded-lg relative group"
            style={{
              background: 'linear-gradient(145deg, rgba(40, 40, 40, 0.8), rgba(30, 30, 30, 0.8))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
            <Download className="w-4 h-4" style={{ color: COLORS['neon-yellow'] }} />
            <span style={{ color: COLORS['neon-yellow'] }}>Download</span>
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(145deg, ${COLORS['neon-yellow']}10, transparent)`,
              }}
            />
          </motion.button>
        </div>

        {/* Enhanced progress dots */}
        <div className="flex justify-center gap-3 mt-6">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: currentSlide === index ? 1.2 : 1,
                opacity: currentSlide === index ? 1 : 0.5,
              }}
              className="relative group cursor-pointer"
              onClick={() => setCurrentSlide(index)}>
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: currentSlide === index ? COLORS['neon-yellow'] : COLORS['enhanced-grey'],
                }}
              />
              <div
                className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50"
                style={{
                  background: COLORS['neon-yellow'],
                  transform: 'scale(1.5)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecapPage;
