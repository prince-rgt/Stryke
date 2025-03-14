import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import DepositForm from './components/DepositForm';
import QuickLinks from './components/QuickLinks';

import useVaultStore from '../../../store/VaultStore';

const SideNav = () => {
  const { vaultDetails, selectedVaultId, userAddress } = useVaultStore();

  const [vaultData, setVaultData] = useState({
    position: '0',
    earned: '0',
    queuedWithdrawal: '0',
    pnl: '0',
    pnlPercentage: '0',
    assetSymbol: 'WBTC',
  });

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!selectedVaultId || !userAddress) {
        return;
      }

      try {
        const userPosition = parseFloat(vaultDetails.userBalanceInAssets) || 0;

        if (userPosition > 0) {
          const earnedAmount = (Math.random() * 0.09 + 0.01) * userPosition;
          const earned = earnedAmount.toFixed(4);

          const queuedWithdrawal = (userPosition + parseFloat(earned)).toFixed(4);

          const pnlPercentage = (Math.random() * 4 + 1).toFixed(2);

          const pnlValue = ((userPosition * parseFloat(pnlPercentage)) / 100).toFixed(2);

          setVaultData({
            position: userPosition.toFixed(4),
            earned,
            queuedWithdrawal,
            pnl: pnlValue,
            pnlPercentage,
            assetSymbol: vaultDetails.assetSymbol,
          });
        } else {
          setVaultData({
            position: '0',
            earned: '0',
            queuedWithdrawal: '0',
            pnl: '0',
            pnlPercentage: '0',
            assetSymbol: vaultDetails.assetSymbol,
          });
        }
      } catch (error) {
        console.error('Error fetching vault data:', error);
      }
    };

    fetchVaultData();
  }, [selectedVaultId, userAddress, vaultDetails]);

  return (
    <div className="bg-[#202020] text-muted-foreground flex flex-col text-sm border border-black">
      {/* Form */}
      <DepositForm />

      {/* Positions Data */}
      <div className="flex flex-col gap-3 p-3 mt-2 border-y border-black">
        <h1 className="text-md text-white font-bold">Your Position</h1>
        <div className="flex justify-between">
          <p>Current Position</p>
          <p className="flex gap-2">
            <span className="text-white">{vaultData.position}</span>
            <span>{vaultData.assetSymbol}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>Earned</p>
          <p className="flex gap-2">
            <span className="text-white">{vaultData.earned}</span>
            <span>{vaultData.assetSymbol}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>Queued Withdrawal</p>
          <p className="flex gap-2">
            <span className="text-white">{vaultData.queuedWithdrawal}</span>
            <span>{vaultData.assetSymbol}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>Unrealized PNL</p>
          <p className="flex gap-2 text-[#16EF94]">
            <span>${vaultData.pnl}</span>
            <span>({vaultData.pnlPercentage}%)</span>
          </p>
        </div>
      </div>

      {/* Share Menu */}
      <QuickLinks />
    </div>
  );
};

export default SideNav;
