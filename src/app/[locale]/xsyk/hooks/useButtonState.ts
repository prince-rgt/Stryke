import { noop } from 'lodash';
import { useMemo } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

type Props = {
  amount: string;
  balance: bigint | undefined;
  action: () => void | undefined;
  actionLabel: string;
};

/**
 * @description Returns the button state for input panels for xsyk / xsyk staking pages.
 */
const useButtonState = (props: Props) => {
  const { amount, balance, action, actionLabel } = props;
  const { address: user, chainId } = useAccount();

  const buttonState = useMemo(() => {
    const defaultState = { label: actionLabel, action: noop, disabled: true };
    if (!user) return { ...defaultState, label: 'Connect Wallet' };
    else if (chainId !== 42161) return { ...defaultState, label: 'Switch network to Arbitrum' };
    else if (Number(amount) === 0) return { ...defaultState };
    else if (balance && balance < parseEther(amount)) return { ...defaultState, label: 'Insufficient Balance' };
    else return { ...defaultState, action, disabled: false };
  }, [user, chainId, amount, balance, action, actionLabel]);

  return buttonState;
};

export default useButtonState;
