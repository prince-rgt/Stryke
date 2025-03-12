'use client';

import useVaultStore from '@/app/[locale]/dashboard/store/VaultStore';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { approveTokenForVault, depositToVault } from '@/utils/actions/varrock/writetransactions';
import { formatDate } from '@/utils/helpers';

import { Button } from '@/components/ui/button';

import { BTC } from '@/assets/images';

const DepositForm = () => {
  const [amount, setAmount] = useState<string>('0');
  const [tokenSymbol, setTokenSymbol] = useState<string>('WBTC');
  const [currentEpoch, setCurrentEpoch] = useState<bigint | null>(null);
  const [nextEpoch, setNextEpoch] = useState<bigint | null>(null);
  const [nextEpochDate, setNextEpochDate] = useState<Date | null>(null);
  const [timeToNextEpoch, setTimeToNextEpoch] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [vaultDetails, setVaultDetails] = useState<any>(null);
  const [isCurrentEpochActive, setIsCurrentEpochActive] = useState<boolean>(false);
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);

  const { address: user = '0x' } = useAccount();
  const { getSelectedVaultAddress, selectedVaultId, getSelectedVaultDetails } = useVaultStore();

  const updateCountdown = () => {
    if (nextEpochDate) {
      const now = new Date();
      const diff = nextEpochDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeToNextEpoch('0D 0H 0M');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeToNextEpoch(`${days}D ${hours}H ${minutes}M`);
    }
  };

  const fetchVaultData = async () => {
    try {
      const details = await getSelectedVaultDetails();
      setVaultDetails(details);
      console.log('fetchVaultData', details);

      setIsCurrentEpochActive(details.currentEpochData.isActive);

      if (selectedVaultId?.includes('BTC')) {
        setTokenSymbol('WBTC');
      } else if (selectedVaultId?.includes('ETH')) {
        setTokenSymbol('WETH');
      }
      const currentEpochId = details.currentEpoch;
      setCurrentEpoch(currentEpochId);

      const nextEpochId = currentEpochId + 1n;
      setNextEpoch(nextEpochId);

      const currentEpochStartTime = new Date();
      const nextEpochStartTime = new Date(currentEpochStartTime.getTime() + Number(details.epochDuration) * 1000);
      setNextEpochDate(nextEpochStartTime);

      setTokenBalance(details.assetUserBalance);

      checkAllowance(details);
    } catch (err) {
      console.error('Error fetching vault data:', err);
    }
  };

  useEffect(() => {
    if (selectedVaultId) {
      fetchVaultData();
    }
  }, [selectedVaultId, getSelectedVaultDetails]);

  useEffect(() => {
    updateCountdown();
    const updateTimeInterval = setInterval(updateCountdown, 60000);
    return () => clearInterval(updateTimeInterval);
  }, [nextEpochDate]);

  useEffect(() => {
    if (vaultDetails) {
      checkAllowance(vaultDetails);
    }
  }, [amount]);

  const checkAllowance = (details = vaultDetails) => {
    if (!details || !amount || parseFloat(amount) <= 0) {
      setNeedsApproval(false);
      return;
    }

    try {
      const allowance = details.assetUserAllowance;
      const needsApprove = allowance < amount;
      setNeedsApproval(needsApprove);
    } catch (error) {
      console.error('Error checking allowance:', error);
      setNeedsApproval(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleMaxClick = () => {
    setAmount(tokenBalance);
  };

  const handleApprove = async () => {
    if (!vaultDetails || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const vaultAddress = getSelectedVaultAddress();
    if (!vaultAddress || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await approveTokenForVault(
        vaultDetails.asset as `0x${string}`,
        vaultAddress,
        amount,
        vaultDetails.assetDecimals,
      );

      if (result) {
        await fetchVaultData();
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error during approval:', error);
      setIsProcessing(false);
    }
  };

  const handleDeposit = async () => {
    if (!vaultDetails || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const vaultAddress = getSelectedVaultAddress();
    if (!vaultAddress || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await depositToVault(vaultAddress, amount, vaultDetails.assetDecimals, user);

      if (result) {
        setAmount('0');
        await fetchVaultData();
      }
      setIsProcessing(false);
    } catch (error) {
      console.error('Error during deposit:', error);
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      );
    }

    if (!amount || amount === '0') {
      return 'Enter Amount';
    }

    if (needsApproval) {
      return 'Approve';
    }

    return 'Deposit';
  };

  const handleButtonClick = () => {
    if (!amount || amount === '0' || isProcessing || isCurrentEpochActive) {
      return;
    }

    if (needsApproval) {
      handleApprove();
    } else {
      handleDeposit();
    }
  };

  return (
    <div className="justify-between p-3 h-full">
      {/* Form */}
      <div className="bg-[#2C2C2C] p-4 mb-20">
        <div className="flex justify-between items-center w-full">
          <div className="text-left w-2/3">
            <p>Deposit</p>
            <input
              type="number"
              placeholder="0.00"
              value={amount !== '0' ? amount : ''}
              onChange={handleAmountChange}
              className="bg-transparent text-2xl placeholder:text-muted-foreground text-white font-medium w-full"
            />
          </div>
          <div className="flex items-center justify-center gap-1 bg-[#3C3C3C] rounded px-1.5 h-9 text-sm text-white ml-2">
            <Image src={BTC} alt="" className="size-6" />
            <span>{tokenSymbol}</span>
          </div>
        </div>
        <div className="flex justify-between w-full my-2">
          <p> ≈ $ {Number(amount)} </p>
          <p className="flex gap-2">
            <span>Balance: </span>
            <span className="text-white">
              {' '}
              {Number(tokenBalance).toFixed(4)}{' '}
              <button onClick={handleMaxClick} className="text-[#EBFF00] ml-1">
                Max
              </button>
            </span>
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex justify-between my-2">
        <p>Entry epoch</p>
        <p className="text-white">
          Epoch {nextEpoch?.toString()} ({formatDate(nextEpochDate)})
        </p>
      </div>
      <div className="flex justify-between my-2">
        <p>Starts In</p>
        <p className="text-[#EBFF00]">{timeToNextEpoch}</p>
      </div>

      {/* Withdrawal Info Box */}
      <div className="p-3 bg-gradient-to-l from-[#2C2C2C] from-30% to-[#EBFF0000] text-medium border border-white/20 rounded">
        <h1 className="text-white mb-3 text-md">Withdrawal Instructions</h1>
        <p>
          Your deposit will be queued for <span className="text-[#EBFF00]">Epoch {nextEpoch?.toString()}</span> . Funds
          will automatically roll into future epochs unless you queue a withdrawal before the epoch ends.
        </p>
      </div>

      <div className="flex flex-col mt-3 text-sm">
        <Button
          disabled={!amount || amount === '0' || isProcessing || isCurrentEpochActive}
          onClick={handleButtonClick}
          className={`relative ${needsApproval ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}>
          {isCurrentEpochActive && amount && amount !== '0' ? 'Current Epoch Active' : getButtonText()}
        </Button>

        {isCurrentEpochActive && amount && amount !== '0' && (
          <p className="text-xs text-yellow-300 mt-2">
            Cannot deposit during active epoch. Please wait for the next epoch.
          </p>
        )}
      </div>
    </div>
  );
};

export default DepositForm;
