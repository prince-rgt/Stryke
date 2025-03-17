'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

import { Dollar } from '@/assets/images';

import useVaultStore from '../../store/VaultStore';

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
  const { address } = useAccount();
  const { setUserAddress } = useVaultStore();
  const setSelectedVaultId = useVaultStore((state) => state.setSelectedVaultId);

  const handleDeposit = () => {
    setUserAddress(address as `0x${string}`);
    setSelectedVaultId(header);
    if (handleClick) {
      handleClick();
    } else {
      router.push(`/dashboard/vaults?vid=${header}`);
    }
  };

  return (
    <div className="border-2 border-black rounded p-4 w-[21rem] group hover:bg-gradient-to-br from-white/10 to-secondary/10">
      {/* Card header */}
      <div className="flex mb-12 gap-3">
        <div className="relative">
          <Image src={imgSrc} alt="Bitcoin" className={`${hasdollar && 'size-9'}`} />
          {hasdollar && <Image src={Dollar} alt="" className="absolute bottom-4 right-0 w-4 h-4" />}
        </div>
        <div className="font-bold">
          <h1 className="text-lg transition duration-300 ease-in-out group-hover:translate-x-3 group-hover:scale-110">
            {header}
          </h1>
          <small className="text-muted-foreground">Call Spreads</small>
        </div>
      </div>

      {/* Card Body - Buttons */}
      <div className="flex gap-4 font-mono text-sm flex-wrap">{children}</div>

      <p className="font-mono my-4 text-sm">{percentages}</p>

      <button
        onClick={handleDeposit}
        className="text-black text-sm bg-white px-3 py-2 rounded font-medium hover:bg-white/90 transition-colors">
        Deposit
      </button>
    </div>
  );
};

export default CardItem;
