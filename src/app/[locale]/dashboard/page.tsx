import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Metadata } from 'next';
import Image from 'next/image';

import { Link } from '@/navigation';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Typography } from '@/components/ui/typography';
import { MarketTable } from '../components/markets-table';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

import { CAROUSEL_ITEMS } from './carousel-items';
import PnlChart from './pnl-chart';
import {BTC, ETH, Dollar } from "../../../assets/images"

export const metadata: Metadata = {
  title: 'Dashboard | Stryke',
  description: 'View all available option markets and your trading performance on Stryke.',
  openGraph: {
    title: 'Dashboard | Stryke',
    description: 'View all available option markets and your trading performance on Stryke.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

const Dashboard: React.FC = () => {
  if (true) {
    return (
      <div className='p-5 overflow-y-auto'>
        <h1 className='font-black text-3xl py-4'>Vaults.</h1>
        <p className='text-md font-medium w-2/5 text-muted-foreground'>
          Simplify and automate your trading strategy by depositing into one of Stryke's vaults 
          that utilize various strategies that are centralized, decentralized or a hybrid.
        </p>

        {/* Categories */}
        <div className='my-6'>
          <h1 className='font-black text-xl py-2'>Sorted by Strategies</h1>

          <div className='flex gap-0.5 my-2 text-sm'>
            <button className='px-3 py-2 bg-[#3C3C3C] font-medium text-white'>Call Spreads</button>
            <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>Reversal</button>
            <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>Bidirectional Hedge</button>
            <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>Fixed Range Liquidity</button>
          </div>

          <div className='bg-[#202020] border-2 border-black p-3 flex gap-4 w-full my-4'>
            <div className='w-4/12 border-2 border-black flex justify-center items-center text-white/50'>
              <p>- Chart -</p>
            </div>
            <div className='w-8/12 text-sm'>
              <h2 className='text-muted-foreground mb-3'>Call Spreads Explained</h2>
              <p className='mb-20'>
                A call spread buys a call on a strike, and selling another call on a higher strike of the same expiry. 
                They work well if you intend to profit from a moderate increase in the price of the underlying asset.
              </p>
              <button className='p-2 bg-[#3C3C3C] font-medium text-white flex gap-2'>
                <OpenInNewWindowIcon className="h-5 w-5" />
                <span>Call Spreads</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className='flex my-2'>

            <div className='border-2 border-black rounded p-4'>
              {/* Card header */}
              <div className='flex mb-12 gap-3'>
                <div className='relative'>
                  <Image src={BTC} alt="Bitcoin" className='' />
                  {/* <Image src={Dollar} alt='' className='absolute bottom-4 right-0 w-4 h-4'/> */}
                </div>
                <div className='font-bold'>
                  <h1 className='text-lg'>BTC Superball Monthly</h1>
                  <small className='text-muted-foreground'>Call Spreads</small>
                </div>
              </div>

              {/* Card Body - Buttons */}
              <div className='flex gap-4 font-mono text-sm flex-wrap'>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>MONTHLY</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>DEPOSIT WBTC</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>CENTRALIZED</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-[#EBFF00]'>EXTRA REWARDS</button>
              </div>

              <p className='font-mono my-4'>
                {13.31}% - {491.11}%
              </p>

              <button className='text-black text-sm bg-white px-3 py-2 rounded font-medium'>
                Deposit
              </button>
            </div>

            <div className='border-2 border-black rounded p-4'>
              {/* Card header */}
              <div className='flex mb-12 gap-3'>
                <div className='relative'>
                  <Image src={ETH} alt="Bitcoin" className='w-9 h-9' />
                  <Image src={Dollar} alt='' className='absolute bottom-4 -right-1 w-4 h-4'/>
                </div>
                <div className='font-bold'>
                  <h1 className='text-lg'>ETH Superbull Monthly</h1>
                  <small className='text-muted-foreground'>Call Spreads</small>
                </div>
              </div>

              {/* Card Body - Buttons */}
              <div className='flex gap-4 font-mono text-sm flex-wrap'>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>QUARTERLY</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>DEPOSIT WETH</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>CENTRALIZED</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-[#EBFF00]'>EXTRA REWARDS</button>
              </div>

              <p className='font-mono my-4'>
                {13.31}% - {491.11}%
              </p>

              <button className='text-black text-sm bg-white px-3 py-2 rounded font-medium'>
                Deposit
              </button>
            </div>

            <div className='border-2 border-black rounded p-4'>
              {/* Card header */}
              <div className='flex mb-12 gap-3'>
                <div className='relative'>
                  <Image src={ETH} alt="Bitcoin" className='w-9 h-9' />
                  <Image src={Dollar} alt='' className='absolute bottom-4 -right-1 w-4 h-4'/>
                </div>
                <div className='font-bold'>
                  <h1 className='text-lg'>ETH Superball Quarterly</h1>
                  <small className='text-muted-foreground'>Call Spreads</small>
                </div>
              </div>

              {/* Card Body - Buttons */}
              <div className='flex gap-4 font-mono text-sm flex-wrap'>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>QUARTERLY</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>DEPOSIT ETH</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>CENTRALIZED</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-[#EBFF00]'>EXTRA REWARDS</button>
              </div>

              <p className='font-mono my-4'>
                {13.31}% - {491.11}%
              </p>

              <button className='text-black text-sm bg-white px-3 py-2 rounded font-medium'>
                Deposit
              </button>
            </div>

            <div className='border-2 border-black rounded p-4'>
              {/* Card header */}
              <div className='flex mb-12 gap-3'>
                <div className='relative'>
                  <Image src={ETH} alt="Bitcoin" className='w-9 h-9' />
                  <Image src={Dollar} alt='' className='absolute bottom-4 -right-1 w-4 h-4'/>
                </div>
                <div className='font-bold'>
                  <h1 className='text-lg'>BTC Superball Monthly</h1>
                  <small className='text-muted-foreground'>Call Spreads</small>
                </div>
              </div>

              {/* Card Body - Buttons */}
              <div className='flex gap-4 font-mono text-sm flex-wrap'>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>MONTHLY</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>DEPOSIT ETH</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40'>CENTRALIZED</button>
                <button className='px-3 py-2 bg-[#3C3C3C]/70 font-medium text-[#EBFF00]'>EXTRA REWARDS</button>
              </div>

              <p className='font-mono my-4'>
                {13.31}% - {491.11}%
              </p>

              <button className='text-black text-sm bg-white px-3 py-2 rounded font-medium'>
                Deposit
              </button>
            </div>

          </div>

        </div>

      </div>
    )
  }

  return (
    // todo: find a  better way to do this, 48px is height of the header
    <div style={{ height: 'calc(100% - 40px)' }} className="my-[1px] flex flex-col">
      <div className="flex space-x-[1px]">
        <div className="w-1/2">
          <PnlChart />
        </div>
        <div className="w-1/2 bg-primary">
          <Carousel className="w-full p-md pb-6" opts={{ loop: true }}>
            <CarouselContent>
              {CAROUSEL_ITEMS.map(({ imageUrl, text, button: { href, label, openInNewWindow } }, index) => (
                <CarouselItem
                  key={href}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="h-64">
                  <div className="flex h-full flex-col items-center justify-center space-y-md px-16">
                    <Typography>{text}</Typography>
                    <div className="flex">
                      <Link href={href} target={openInNewWindow ? '_blank' : undefined}>
                        <Button variant={'ghost'} className="border border-border" size={'md'}>
                          <Typography>{label}</Typography>
                          {openInNewWindow && <OpenInNewWindowIcon className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselNavigation />
          </Carousel>
        </div>
      </div>
      <MarketTable />
    </div>
  );
};

export default Dashboard;
