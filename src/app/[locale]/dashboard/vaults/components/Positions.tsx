import { useEffect, useState } from 'react';

import { getUserDeposits } from '@/utils/actions/varrock/getUserDeposits';

import useVaultStore from '../../store/VaultStore';
import { ButtonV1 } from './Buttons';
import Tooltip from './Tooltip';

interface PositionData {
  epoch: number;
  date: string;
  amount: string;
  status: 'active' | 'closed';
  pnl: number;
  yield: number;
  current: boolean;
  depositId: string;
}

const Positions = () => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const { userAddress, vaultAddress, vaultDetails } = useVaultStore();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        if (!vaultAddress || !userAddress) {
          setPositions([]);

          return;
        }

        const deposits = await getUserDeposits(vaultAddress, userAddress);
        const formattedPositions: PositionData[] = deposits.map((deposit, index) => {
          const epochNumber = parseInt(deposit.epoch);

          const isCurrent = vaultDetails?.currentEpoch == BigInt(epochNumber);

          const date = new Date();
          date.setDate(date.getDate() - index * 7);

          const amount = deposit.totalAssets ? (parseFloat(deposit.totalAssets) / 1e18).toFixed(2) : '0.00';

          const isProfitable = index % 2 === 0;
          const pnl = isProfitable ? 3.41 : -2.15;
          const yieldValue = isProfitable ? 3.41 : -2.15;

          return {
            epoch: epochNumber,
            date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            amount,
            status: isCurrent ? 'active' : 'closed',
            pnl,
            yield: yieldValue,
            current: isCurrent,
            depositId: deposit.id,
          };
        });

        formattedPositions.sort((a, b) => {
          if (a.current && !b.current) return -1;
          if (!a.current && b.current) return 1;
          return b.epoch - a.epoch;
        });

        setPositions(formattedPositions);
      } catch (err) {
        console.error('Error fetching positions:', err);
      } finally {
      }
    };

    fetchPositions();
  }, [userAddress, vaultAddress, vaultDetails]);

  if (positions.length === 0) {
    return <div className="pb-12 text-center py-8">No positions found for this vault.</div>;
  }

  return (
    <div className="pb-12">
      <table className="w-full text-xs text-left">
        <thead className="bg-secondary border-2 border-black text-muted-foreground py-2 uppercase">
          <tr>
            <th className="py-1.5 pl-2">Epoch</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>PNL</th>
            <th>Yield</th>
            <th className="text-right pr-2">Action</th>
          </tr>
        </thead>
        <tbody className="bg-secondary border-2 border-black">
          {positions.map((position, index) => (
            <tr key={position.depositId} className="">
              <td className="py-3 pl-4 flex items-center">
                <span className="w-5">{position.epoch}</span>
                {position.current && (
                  <button className="ml-2 uppercase px-2 py-1.5 rounded bg-[#3C3C3C] text-muted-foreground">
                    Current
                  </button>
                )}
              </td>
              <td>{position.date}</td>
              <td className="flex gap-1">
                <span>{position.amount}</span>
                <span className="text-muted-foreground">WBTC</span>
              </td>
              <td className="">
                {position.status === 'active' ? (
                  <ButtonV1 label="ACTIVE" classes="bg-[#3C3C3C] text-[#EBFF00] w-16 text-center" />
                ) : (
                  <ButtonV1 label="CLOSED" classes="bg-[#3C3C3C] text-muted-foreground w-16 text-center" />
                )}
              </td>
              <td>
                <Tooltip
                  content={
                    <div className="flex flex-col gap-2 w-[9.6rem]">
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">WBTC</span>
                        <span className="font-mono">
                          {((parseFloat(position.amount) * position.pnl) / 100).toFixed(4)}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-muted-foreground">USD</span>
                        <span className="font-mono">
                          ${((parseFloat(position.amount) * 42000 * position.pnl) / 100).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  }>
                  <span
                    className={`underline ${position.pnl > 0 ? 'text-[#16EF94] decoration-[#16EF94]' : 'text-red-500 decoration-red-500'}`}>
                    {position.pnl > 0 ? '+' : '-'} {Math.abs(position.pnl).toFixed(2)}%
                  </span>
                </Tooltip>
              </td>
              <td>
                <span
                  className={`underline ${position.yield > 0 ? 'text-[#16EF94] decoration-[#16EF94]' : 'text-red-500 decoration-red-500'}`}>
                  {position.yield > 0 ? '+' : '-'} {Math.abs(position.yield).toFixed(2)}%
                </span>
              </td>
              <td className="text-right pr-2">
                {position.status === 'active' ? (
                  <button className="bg-white rounded p-1 text-black">Queue Withdrawal</button>
                ) : (
                  <button className="bg-[#3C3C3C] p-1 rounded">Withdrawn</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Positions;
