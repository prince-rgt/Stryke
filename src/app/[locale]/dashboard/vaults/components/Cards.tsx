'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Dollar } from '@/assets/images';

interface CardItemProps {
  header: string;
  imgSrc: string;
  hasdollar?: boolean;
  handleClick?: () => void;
  children?: React.ReactNode;
  percentages: React.ReactNode;
}

const CardItem = ({ header, imgSrc, hasdollar, handleClick, children, percentages }: CardItemProps) => {
  const router = useRouter();

  const handleDeposit = () => {
    if (handleClick) {
      handleClick();
    } else {
      router.push('/dashboard/vaults');
    }
  };

  return (
    <div className="border-2 border-black rounded p-4 w-[21rem]">
      {/* Card header */}
      <div className="flex mb-12 gap-3">
        <div className="relative">
          <Image src={imgSrc} alt="Bitcoin" className={`${hasdollar && 'size-9'}`} />
          {hasdollar && <Image src={Dollar} alt="" className="absolute bottom-4 right-0 w-4 h-4" />}
        </div>
        <div className="font-bold">
          <h1 className="text-lg"> {header} </h1>
          <small className="text-muted-foreground">Call Spreads</small>
        </div>
      </div>

      {/* Card Body - Buttons */}
      <div className="flex gap-4 font-mono text-sm flex-wrap">{children}</div>

      <p className="font-mono my-4">{percentages}</p>

      <button
        onClick={handleDeposit}
        className="text-black text-sm bg-white px-3 py-2 rounded font-medium hover:bg-white/90 transition-colors">
        Deposit
      </button>
    </div>
  );
};

export default CardItem;
