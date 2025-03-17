import useVaultStore from '@/app/[locale]/dashboard/store/VaultStore';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const ConnectWallet = () => {
  const t = useTranslations('Header');
  const { address } = useAccount();
  const { userAddress, setUserAddress } = useVaultStore();
  useEffect(() => {
    if (!userAddress) {
      setUserAddress(address as `0x${string}`);
    }
  }, [address]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}>
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="accent" size={'sm'} className="bg-rgby-gradient">
                    <Typography variant="small-medium">{t('ConnectWallet')}</Typography>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    variant={'secondary'}
                    className="bg-destructive hover:bg-destructive/75"
                    size={'sm'}
                    onClick={openChainModal}>
                    <Typography variant={'small-medium'}>{t('WrongNetwork')}</Typography>
                  </Button>
                );
              }
              return (
                <div className="flex space-x-md">
                  <Button variant={'ghost'} size={'sm'} onClick={openChainModal}>
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}>
                        {chain.iconUrl && (
                          <Image alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} width={16} height={16} />
                        )}
                      </div>
                    )}
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                  <Button onClick={openAccountModal} variant="secondary" size={'sm'}>
                    <Typography variant={'small-medium'}>{account.displayName}</Typography>
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
