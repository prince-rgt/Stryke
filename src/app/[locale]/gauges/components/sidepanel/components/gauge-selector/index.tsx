import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';

import useGaugeControllerStore from '../../../../hooks/store/useGaugeControllerStore';
import useGaugeController from '../../../../hooks/useGaugeController';

const GaugeSelector: React.FC = () => {
  const { selectedRow, updateSelectedRow } = useGaugeControllerStore();
  const { processedGaugesArray } = useGaugeController();

  const gaugesArray = useMemo(() => processedGaugesArray || [], [processedGaugesArray]);

  const handleGaugeSelect = useCallback(
    (gaugeName: string) => {
      const newSelectedRow = gaugesArray.find((data) => data.name === gaugeName);
      if (newSelectedRow) {
        updateSelectedRow(newSelectedRow);
      }
    },
    [gaugesArray, updateSelectedRow],
  );

  if (gaugesArray.length === 0) return null;

  return (
    <div>
      <Select
        onValueChange={handleGaugeSelect}
        value={selectedRow?.name || 'select'}
        disabled={gaugesArray.length === 0}>
        <SelectTrigger className="w-full bg-muted text-foreground h-8">
          <SelectValue>
            {selectedRow ? (
              <div className="flex items-center">
                <div className="mr-2 flex">
                  {selectedRow.logo.map((logo, index) => (
                    <div
                      key={index}
                      className={`${index !== 0 ? '-ml-2' : ''} relative`}
                      style={{ zIndex: selectedRow.logo.length - index }}>
                      <Image
                        width={16}
                        height={16}
                        src={logo}
                        alt={`${selectedRow.name.split(' ')[0]} logo ${index + 1}`}
                        className="h-4 w-4 rounded-full"
                      />
                    </div>
                  ))}
                </div>
                <Typography variant="small-medium">{selectedRow.name}</Typography>
              </div>
            ) : (
              <Typography variant="small-medium" className="text-muted-foreground">
                Select...
              </Typography>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-muted">
          {gaugesArray.map((data) => (
            <SelectItem key={data.name} value={data.name}>
              <div className="flex items-center">
                <div className="mr-2 flex">
                  {data.logo.map((logo, index) => (
                    <div
                      key={index}
                      className={`${index !== 0 ? '-ml-2' : ''} relative`}
                      style={{ zIndex: data.logo.length - index }}>
                      <Image
                        width={24}
                        height={24}
                        src={logo}
                        alt={`${data.name.split(' ')[0]} logo ${index + 1}`}
                        className="h-6 w-6 rounded-full"
                      />
                    </div>
                  ))}
                </div>
                <Typography variant="small-medium">{data.name}</Typography>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default React.memo(GaugeSelector);
