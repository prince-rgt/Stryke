import { useAccount, useSwitchChain } from 'wagmi';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NetworkSelector = () => {
  const { chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  return (
    <Select>
      <SelectTrigger className="w-[180px] bg-transparent border-none">
        <SelectValue placeholder={chain?.name ?? 'Select Network'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {chains.map((chain, key) => (
            <SelectItem
              key={key}
              value={chain.name}
              onClick={() => {
                switchChain({ chainId: chain.id });
                console.log('clicked');
              }}>
              {chain.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default NetworkSelector;
