'use client';

import useVaultStore from '@/app/[locale]/dashboard/store/VaultStore';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import checkAllowance from '@/utils/actions/varrock/checkAlllowance';
import { approveTokenForVault, depositToVault } from '@/utils/actions/varrock/writetransactions';
import { formatDate } from '@/utils/helpers';

import { Button } from '@/components/ui/button';

import { BTC, ETH } from '@/assets/images';

const DepositForm = () => {
  const searchParams = useSearchParams();
  const { selectedVaultId, userAddress, vaultDetails, vaultAddress, updateVault, setSelectedVaultId } = useVaultStore();

  const [amount, setAmount] = useState<string>('0');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenIcon, setTokenIcon] = useState(BTC);
  const [nextEpoch, setNextEpoch] = useState<bigint | null>(null);
  const [nextEpochDate, setNextEpochDate] = useState<Date | null>(null);
  const [timeToNextEpoch, setTimeToNextEpoch] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<string>('0');

  // Handle vault selection from URL and trigger vault update
  useEffect(() => {
    const vid = searchParams.get('vid');
    if (vid && vid !== selectedVaultId) {
      setSelectedVaultId(vid);
      updateVault(); // Ensure vault details are updated when vault changes
    }
  }, [searchParams, selectedVaultId, setSelectedVaultId, updateVault]);

  // Update token symbol and icon based on selected vault
  useEffect(() => {
    if (selectedVaultId?.includes('BTC')) {
      setTokenSymbol('WBTC');
      setTokenIcon(BTC);
    } else if (selectedVaultId?.includes('ETH')) {
      setTokenSymbol('WETH');
      setTokenIcon(ETH);
    }
  }, [selectedVaultId]);

  // Update user balance whenever relevant data changes
  const updateUserBalance = useCallback(() => {
    if (vaultDetails && userAddress) {
      setUserBalance(vaultDetails.assetUserBalance);
    } else {
      setUserBalance('0');
    }
  }, [vaultDetails, userAddress]);

  // Initial balance update and setup
  useEffect(() => {
    updateUserBalance();
  }, [updateUserBalance]);

  // Update balance when vault details change
  useEffect(() => {
    if (vaultDetails) {
      updateUserBalance();
    }
  }, [vaultDetails, updateUserBalance]);

  const updateCountdown = () => {
    if (nextEpochDate) {
      const now = new Date();
      const diff = nextEpochDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeToNextEpoch('0D 0H 0M 0S');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeToNextEpoch(`${days}D ${hours}H ${minutes}M ${seconds}S`);
    }
  };

  const fetchVaultData = async () => {
    try {
      if (!vaultDetails) return;

      const currentEpochId = vaultDetails.currentEpoch;
      const nextEpochId = currentEpochId + 1n;
      setNextEpoch(nextEpochId);

      const currentEpochData = vaultDetails.currentEpochData;
      const nextEpochStartTime =
        currentEpochData.endTime ||
        (currentEpochData.startTime && vaultDetails.epochDuration
          ? new Date(currentEpochData.startTime.getTime() + Number(vaultDetails.epochDuration) * 1000)
          : new Date(Date.now() + Number(vaultDetails.epochDuration) * 1000));

      setNextEpochDate(nextEpochStartTime);

      if (userAddress) {
        await checkAllowanceForDeposit();
        updateUserBalance(); // Update balance after fetching vault data
      }
    } catch (err) {
      console.error('Error fetching vault data:', err);
    }
  };

  useEffect(() => {
    if (selectedVaultId && vaultDetails) {
      fetchVaultData();
    }
  }, [selectedVaultId, vaultDetails]);

  useEffect(() => {
    updateCountdown();
    const updateTimeInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(updateTimeInterval);
  }, [nextEpochDate]);

  useEffect(() => {
    if (vaultDetails && userAddress && vaultAddress && amount !== '0') {
      checkAllowanceForDeposit();
    }
  }, [amount, vaultDetails, userAddress, vaultAddress]);

  const checkAllowanceForDeposit = async () => {
    if (!vaultDetails || !userAddress || !vaultAddress || !amount || parseFloat(amount) <= 0) {
      setNeedsApproval(false);
      return;
    }

    try {
      const hasAllowance = await checkAllowance(
        vaultDetails.asset as `0x${string}`,
        vaultAddress as `0x${string}`,
        userAddress as `0x${string}`,
        amount,
        vaultDetails.assetDecimals,
      );

      setNeedsApproval(!hasAllowance);
    } catch (error) {
      console.error('Error checking allowance:', error);
      setNeedsApproval(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || value === '0' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (userBalance && parseFloat(userBalance) > 0) {
      setAmount(userBalance);
    }
  };

  const handleApprove = async () => {
    if (!vaultDetails || !amount || parseFloat(amount) <= 0) {
      return;
    }
    if (!vaultAddress || !userAddress) {
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
        await checkAllowanceForDeposit();
        await fetchVaultData();
        updateUserBalance(); // Update balance after approval
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

    if (!vaultAddress || !userAddress) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await depositToVault(vaultAddress, amount, vaultDetails.assetDecimals, userAddress);

      if (result) {
        updateVault();
        setAmount('0');
        await fetchVaultData();
        updateUserBalance(); // Update balance after deposit
      }
      setIsProcessing(false);
    } catch (error) {
      console.error('Error during deposit:', error);
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (!userAddress) {
      return 'Connect Wallet';
    }

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
    if (!userAddress) {
      // Handle wallet connection - you might want to trigger your wallet connection flow here
      return;
    }

    if (!amount || amount === '0' || isProcessing || vaultDetails?.currentEpochData.isActive) {
      return;
    }

    if (needsApproval) {
      handleApprove();
    } else {
      handleDeposit();
    }
  };

  if (!selectedVaultId || !vaultDetails) {
    return null;
  }

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
            <Image src={tokenIcon} alt="" className="size-6" />
            <span>{tokenSymbol}</span>
          </div>
        </div>
        <div className="flex justify-between w-full my-2">
          <p> ≈ $ {Number(amount)} </p>
          <p className="flex gap-2">
            <span>Balance: </span>
            <span className="text-white">
              {userAddress ? Number(userBalance).toFixed(4) : '0.0000'}{' '}
              {userAddress && parseFloat(userBalance) > 0 && (
                <button onClick={handleMaxClick} className="text-[#EBFF00] ml-1">
                  Max
                </button>
              )}
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
          disabled={!userAddress || !amount || amount === '0' || isProcessing || vaultDetails.currentEpochData.isActive}
          onClick={handleButtonClick}
          className={`relative ${needsApproval ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}>
          {vaultDetails.currentEpochData.isActive && amount && amount !== '0'
            ? 'Current Epoch Active'
            : getButtonText()}
        </Button>

        {vaultDetails.currentEpochData.isActive && amount && amount !== '0' && (
          <p className="text-xs text-yellow-300 mt-2">
            Cannot deposit during active epoch. Please wait for the next epoch.
          </p>
        )}
      </div>
    </div>
  );
};

export default DepositForm;
