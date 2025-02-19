import React from 'react';

interface NumberDisplayProps {
  value: number | null | undefined;
  format: 'usd' | 'percent' | 'tokenAmount';
  precision?: number;
  showDecimalZerosSubscript?: boolean;
}

const formatLargeNumber = (value: number, precision?: number): string => {
  const billion = 1e9;
  const million = 1e6;
  const absValue = Math.abs(value);

  let formattedNumber: string;

  if (absValue >= billion) {
    formattedNumber = `${(absValue / billion).toFixed(precision || 3)}B`;
  } else if (absValue >= million) {
    formattedNumber = `${(absValue / million).toFixed(precision || 3)}M`;
  } else {
    formattedNumber = absValue.toFixed(precision || 4);
  }

  return value < 0 ? `-${formattedNumber}` : formattedNumber;
};

export const formatForDisplay = ({ value, format, precision }: NumberDisplayProps): string => {
  if (!value && value !== 0) {
    return '';
  }

  const parseTokenAmount = (value: number): string => {
    return formatLargeNumber(value, precision || 4);
  };

  const parseUSD = (value: number): string => {
    return formatLargeNumber(value, precision || 2);
  };

  const parsePercentage = (value: number): string => {
    return formatLargeNumber(value, precision || 2);
  };

  switch (format) {
    case 'usd':
      return `$ ${parseUSD(value)}`;
    case 'percent':
      return `${parsePercentage(value)}%`;
    case 'tokenAmount':
      return parseTokenAmount(value);
    default:
      return '';
  }
};

const NumberDisplay = ({ value = 0, format, precision, showDecimalZerosSubscript }: NumberDisplayProps) => {
  const [integer, decimal] = formatForDisplay({ value, format, precision }).split('.');
  let zeroCount = 0;
  if (decimal) {
    for (let i = 0; i < decimal.length; i++) {
      if (decimal[i] !== '0') {
        break;
      }
      zeroCount++;
    }
  }

  return (
    <>
      <span>
        {integer}
        {showDecimalZerosSubscript && zeroCount > 2 && decimal.slice(zeroCount) ? (
          <>
            <span>.</span>
            <span>0</span>
            <sub className="text-[8px]]">{zeroCount}</sub>
            <span>{decimal.slice(zeroCount)}</span>
          </>
        ) : (
          decimal && (
            <>
              <span>.</span>
              <span>{decimal}</span>
            </>
          )
        )}
      </span>
    </>
  );
};

export default NumberDisplay;
