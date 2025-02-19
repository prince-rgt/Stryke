import generateSubscript from './generateSubscript';

interface Args {
  value: number | null | undefined;
  format: 'usd' | 'percent' | 'tokenAmount';
  precision?: number;
  showDecimalZerosSubscript?: boolean;
}

const formatLargeNumber = (value: number, precision?: number): string => {
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;
  const absValue = Math.abs(value);

  let formattedNumber: string;

  if (absValue >= billion) {
    formattedNumber = `${(absValue / billion).toFixed(precision || 3)}B`;
  } else if (absValue >= million) {
    formattedNumber = `${(absValue / million).toFixed(precision || 3)}M`;
  } else if (absValue >= thousand) {
    formattedNumber = `${(absValue / thousand).toFixed(precision || 3)}K`;
  } else {
    formattedNumber = absValue.toFixed(precision || 4);
  }

  return value < 0 ? `-${formattedNumber}` : formattedNumber;
};

export const formatForDisplay = ({ value, format, precision }: Args): string => {
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
      return `$${parseUSD(value)}`;
    case 'percent':
      return `${parsePercentage(value)}%`;
    case 'tokenAmount':
      return parseTokenAmount(value);
    default:
      return '';
  }
};

const numberFormatter = ({ value = 0, format, precision, showDecimalZerosSubscript }: Args) => {
  const [integer, decimal] = formatForDisplay({
    value,
    format,
    precision,
  }).split('.');
  let zeroCount = 0;
  if (decimal) {
    for (let i = 0; i < decimal.length; i++) {
      if (decimal[i] !== '0') {
        break;
      }
      zeroCount++;
    }
  }

  return `${integer}${
    showDecimalZerosSubscript && zeroCount > 2 && decimal.slice(zeroCount)
      ? `.0${generateSubscript(zeroCount.toString())}${decimal.slice(zeroCount)}`
      : decimal && `.${decimal}`
  }`;
};

export default numberFormatter;
