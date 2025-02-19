import React, { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';

const MockProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increase progress and stop at 80
      setProgress((oldProgress) => {
        if (oldProgress === 90) {
          return oldProgress;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90);
      });
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Progress
      value={progress}
      className="rounded-none"
      colorMap={{
        low: 'bg-highlight',
        medium: 'bg-success-light',
        high: 'bg-success',
      }}
    />
  );
};

export default MockProgressBar;
