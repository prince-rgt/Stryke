type PriceToTickParams = {
  price: number;
  precision0: number;
  precision1: number;
  inversePrice: boolean;
  tickSpacing: number;
};

function priceToTick({ price, precision0, precision1, inversePrice, tickSpacing }: PriceToTickParams): number {
  const _price = (price * (inversePrice ? precision0 : precision1)) / (inversePrice ? precision1 : precision0);
  const tick = Math.floor(Math.log(_price) / Math.log(1.0001));
  return tick - (tick % tickSpacing);
}

export default priceToTick;
