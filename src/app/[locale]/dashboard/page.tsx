import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Metadata } from 'next';

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
  if (false) {
    return <>New Page Content</>;
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
