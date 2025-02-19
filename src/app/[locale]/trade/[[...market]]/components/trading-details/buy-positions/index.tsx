import { useAccount } from 'wagmi';

import { Typography } from '@/components/ui/typography';

import useBuyPositionsData from './hooks/useBuyPositionsData';

import ExerciseButton from './exercise-button';
import ExerciseSettings from './exercise-settings';
import PositionsSummary from './positions-summary';
import BuyPositionsTable from './positions-table';

const BuyPositions = () => {
  const { address } = useAccount();
  const {
    positions,
    isLoading,
    selectedPositions,
    onRowSelectionChange,
    exerciseTxs,
    refetchPositions: refetchBuyPositions,
    exerciseSettings,
    isPreparing,
    resetExercisePositions,
    showNonExercisablePositionToast,
  } = useBuyPositionsData();

  return (
    <div className="flex h-full flex-col bg-secondary">
      <div className="flex items-center justify-between p-md">
        <PositionsSummary positions={positions} />
        <div className="flex items-center space-x-md">
          <ExerciseButton
            resetExercisePositions={resetExercisePositions}
            exerciseTxs={exerciseTxs}
            isPreparing={isPreparing}
          />
          <ExerciseSettings {...exerciseSettings} />
        </div>
      </div>
      {address ? (
        <BuyPositionsTable
          refetchBuyPositions={refetchBuyPositions}
          showNonExercisablePositionToast={showNonExercisablePositionToast}
          isLoading={isLoading}
          positions={positions}
          selectedPositions={selectedPositions}
          onRowSelectionChange={onRowSelectionChange}
        />
      ) : (
        <div className="flex w-full items-center justify-center p-lg">
          <Typography> Connect wallet to view your positions</Typography>
        </div>
      )}
    </div>
  );
};

export default BuyPositions;
