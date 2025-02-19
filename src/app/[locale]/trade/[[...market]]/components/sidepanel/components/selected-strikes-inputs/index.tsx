import { ArrowBottomRightIcon, ArrowTopRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { map } from 'lodash';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';

import { GeneratedStrike } from '@/utils/math/generateStrikes';
import { getTokenLogoURI } from '@/utils/tokens';

import { Link } from '@/navigation';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import StrikeInputTrade from '../../trade-tab/components/strike-input';

import useStrikesStore, { StrikeDisplay } from '../../../../hooks/store/useStrikesStore';

import StrikeInputLP from '../../lp-tab/strike-input';

type CommonProps = {
  errors?: Map<number, string>;
  StrikeDropdownSelection?: React.ReactElement;
};

type TradeProps = CommonProps & {
  side: 'trade';
};

type LpProps = CommonProps & {
  side: 'lp';
  generatedStrikes: GeneratedStrike[];
};

type SelectedStrikesInputsProps = TradeProps | LpProps;

const SelectedStrikesInputs = (props: SelectedStrikesInputsProps) => {
  const { errors, side, StrikeDropdownSelection } = props;
  const {
    selectedStrikes,
    markPrice,
    strikes,
    selectedMarket,
    setSelectedStrikes,
    displayStrikesAsMarketCap,
    quoteAssetPriceUsd,
  } = useStrikesStore();
  const { pair, circulatingSupply } = selectedMarket;

  const callToken = pair?.[0];
  const putToken = pair?.[1];

  const unselectStrike = useCallback(
    (strikePrice: number) => {
      setSelectedStrikes(selectedStrikes.filter((strike) => strike !== strikePrice));
    },
    [selectedStrikes, setSelectedStrikes],
  );

  const selectedStrikesData: { [key: number]: StrikeDisplay } = useMemo(
    () =>
      strikes.reduce(
        (acc, strike) => {
          if (selectedStrikes.includes(strike.strikePrice)) {
            acc[strike.strikePrice] = strike;
          }
          return acc;
        },
        {} as { [key: number]: StrikeDisplay },
      ),
    [selectedStrikes, strikes],
  );

  const renderSelectedStrikesTrade = useCallback(() => {
    return map(selectedStrikesData, (strikeData, strikePrice) => {
      const strikePriceNumber = Number(strikePrice);
      const strikePriceUsd = strikeData.strikePriceUsd;
      const marketCap = strikePriceUsd * circulatingSupply;

      return (
        <div key={strikePrice} className="flex items-center justify-between">
          <div className="flex w-2/5 items-center justify-between">
            <div className="flex">
              {strikePriceNumber >= markPrice ? (
                <ArrowTopRightIcon className="mr-sm h-4 w-4 text-success" />
              ) : (
                <ArrowBottomRightIcon className="mr-sm h-4 w-4 text-destructive" />
              )}
              <Typography variant="small-medium">
                {displayStrikesAsMarketCap ? (
                  <NumberDisplay precision={4} value={marketCap} format="usd" />
                ) : (
                  <NumberDisplay showDecimalZerosSubscript value={strikePriceUsd} precision={4} format="usd" />
                )}
              </Typography>
            </div>
            <Cross1Icon role="button" onClick={() => unselectStrike(strikePriceNumber)} className="ml-auto h-4 w-4" />
          </div>
          <div className="flex w-3/5 items-center pl-md">
            <Image
              width={14}
              height={14}
              src={getTokenLogoURI(strikePriceNumber >= markPrice ? callToken : putToken)}
              alt={strikePriceNumber >= markPrice ? callToken.symbol : putToken.symbol}
              className="h-3.5 w-3.5 rounded-full"
            />
            <StrikeInputTrade strikeData={strikeData} />
          </div>
        </div>
      );
    });
  }, [
    callToken,
    circulatingSupply,
    displayStrikesAsMarketCap,
    markPrice,
    putToken,
    selectedStrikesData,
    unselectStrike,
  ]);

  const selectedStrikesDataLP: { [key: number]: { strikePrice: number; tickLower: number; tickUpper: number } } =
    useMemo(
      () =>
        side === 'lp'
          ? selectedStrikes.reduce(
              (acc, strike) => {
                const strikeDataGeneratedStrikes = props.generatedStrikes.find((s) => s.strike === strike);

                if (strikeDataGeneratedStrikes) {
                  acc[strike] = {
                    strikePrice: strikeDataGeneratedStrikes.strike,
                    tickLower: strikeDataGeneratedStrikes.tickLower,
                    tickUpper: strikeDataGeneratedStrikes.tickUpper,
                  };
                  return acc;
                }

                const strikesDataStrikesChain = strikes.find((s) => s.strikePrice === strike);
                if (strikesDataStrikesChain) {
                  acc[strike] = {
                    strikePrice: strikesDataStrikesChain.strikePrice,
                    tickLower: strikesDataStrikesChain.tickLower,
                    tickUpper: strikesDataStrikesChain.tickUpper,
                  };
                  return acc;
                }
                return acc;
              },
              {} as { [key: number]: { strikePrice: number; tickLower: number; tickUpper: number } },
            )
          : {},
      [props, selectedStrikes, side, strikes],
    );

  const renderSelectedStrikesLP = useCallback(() => {
    return map(selectedStrikesDataLP, ({ strikePrice, tickLower, tickUpper }) => {
      const strikePriceUsd = strikePrice * quoteAssetPriceUsd;
      const marketCap = strikePriceUsd * circulatingSupply;

      return (
        <div key={strikePrice} className="flex items-center justify-between">
          <div className="flex w-2/5 items-center justify-between">
            <div className="flex">
              {strikePrice >= markPrice ? (
                <ArrowTopRightIcon className="mr-sm h-4 w-4 text-success" />
              ) : (
                <ArrowBottomRightIcon className="mr-sm h-4 w-4 text-destructive" />
              )}
              <Typography variant="small-medium">
                {displayStrikesAsMarketCap ? (
                  <NumberDisplay precision={4} value={marketCap} format="usd" />
                ) : (
                  <NumberDisplay showDecimalZerosSubscript value={strikePriceUsd} precision={4} format="usd" />
                )}
              </Typography>
            </div>
            <Cross1Icon role="button" onClick={() => unselectStrike(strikePrice)} className="ml-auto h-4 w-4" />
          </div>
          <div className="flex w-3/5 items-center pl-md">
            <Image
              width={14}
              height={14}
              src={getTokenLogoURI(strikePrice >= markPrice ? callToken : putToken)}
              alt={strikePrice >= markPrice ? callToken.symbol : putToken.symbol}
              className="h-3.5 w-3.5 rounded-full"
            />
            <StrikeInputLP
              strikePrice={strikePrice}
              token={strikePrice >= markPrice ? callToken : putToken}
              tickLower={tickLower}
              tickUpper={tickUpper}
            />
          </div>
        </div>
      );
    });
  }, [
    callToken,
    circulatingSupply,
    displayStrikesAsMarketCap,
    markPrice,
    putToken,
    quoteAssetPriceUsd,
    selectedStrikesDataLP,
    unselectStrike,
  ]);

  return (
    <div className="flex flex-col space-y-2 bg-secondary p-md">
      {StrikeDropdownSelection}
      {selectedStrikes.length ? (
        <>
          <div className="flex justify-between text-muted-foreground">
            <Typography className="uppercase" variant={'caption-bold'}>
              Strike
              {/* {displayStrikesAsMarketCap && `(Market Cap)`} */}
              {selectedStrikes.length > 0 && ` (${selectedStrikes.length} selected)`}
            </Typography>
            <Typography className="uppercase" variant={'caption-bold'}>
              Size
            </Typography>
          </div>
          <div className="flex max-h-[20vh] flex-col space-y-[1px] overflow-auto bg-secondary">
            {side === 'trade' ? renderSelectedStrikesTrade() : renderSelectedStrikesLP()}
            {errors?.size ? (
              <div className="w-full pt-2 text-center">
                <Typography variant={'small-medium'} className="text-destructive">
                  {Array.from(errors)?.[0]?.[1]}
                </Typography>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex flex-col rounded-sm bg-alert-gradient p-md">
          <Typography className="mb-md text-foreground" variant={'small-medium'}>
            Select Strikes to Begin
          </Typography>
          <Typography variant={'small-medium'}>
            To start, select strikes from the {Boolean(StrikeDropdownSelection) ? `dropdown / ` : ``} options chain.{' '}
            <Link
              className="cursor-pointer"
              target="_blank"
              href={'https://learn.stryke.xyz/13d643cdd12080168077eb5728e11b3f'}>
              <span className="text-highlight">Tutorial.</span>
            </Link>
          </Typography>
        </div>
      )}
    </div>
  );
};

export default SelectedStrikesInputs;
