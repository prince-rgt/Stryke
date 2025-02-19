const errorMessages = {
  // AgniSingleTickLiquidityHandlerV2 errors
  '0xf5e97ae2': 'AgniSingleTickLiquidityHandlerV - Before reserve cooldown period.',
  '0x183b0a9f': 'AgniSingleTickLiquidityHandlerV - Liquidity provider is in range.',
  '0x3857f934': 'AgniSingleTickLiquidityHandlerV - Insufficient liquidity.',
  '0x073728dc': 'AgniSingleTickLiquidityHandlerV - Not whitelisted.',

  // ButterSingleTickLiquidityHandlerV2 errors
  '0xdab7116c': 'ButterSingleTickLiquidityHandlerV - Before reserve cooldown period.',
  '0x4b03981f': 'ButterSingleTickLiquidityHandlerV - Liquidity provider is in range.',
  '0x156de18e': 'ButterSingleTickLiquidityHandlerV - Insufficient liquidity.',
  '0xbc89acbe': 'ButterSingleTickLiquidityHandlerV - Not whitelisted.',

  // FusionXV3SingleTickLiquidityHandlerV2 errors
  '0x741db8a2': 'FusionXV3SingleTickLiquidityHandlerV - Before reserve cooldown period.',
  '0x911c9cb9': 'FusionXV3SingleTickLiquidityHandlerV - Liquidity provider is in range.',
  '0x4637b6b0': 'FusionXV3SingleTickLiquidityHandlerV - Insufficient liquidity.',
  '0x26616d37': 'FusionXV3SingleTickLiquidityHandlerV - Not whitelisted.',

  // PancakeV3SingleTickLiquidityHandlerV2 errors
  '0x714f0cb3': 'PancakeV3SingleTickLiquidityHandlerV - Before reserve cooldown period.',
  '0x830f1283': 'PancakeV3SingleTickLiquidityHandlerV - Insufficient liquidity.',
  '0xc6b6cf72': 'PancakeV3SingleTickLiquidityHandlerV - Not whitelisted.',
  '0x3f298f30': 'PancakeV3SingleTickLiquidityHandlerV - Liquidity provider is in range.',

  // UniswapV3SingleTickLiquidityHandlerV2 errors
  '0xa2657bdb': 'UniswapV3SingleTickLiquidityHandlerV - Before reserve cooldown period.',
  '0x9677149b': 'UniswapV3SingleTickLiquidityHandlerV - Liquidity provider is in range.',
  '0x8118326d': 'UniswapV3SingleTickLiquidityHandlerV - Insufficient liquidity.',
  '0x7425a93e': 'UniswapV3SingleTickLiquidityHandlerV - Not whitelisted.',

  // DopexV2OptionMarket errors
  '0xce2bc559': 'DopexV2OptionMarket - Array length mismatch.',
  '0xd2d4b9ac': 'DopexV2OptionMarket - Option is empty.',
  '0x19a509f9': 'DopexV2OptionMarket - Implied volatility not set.',
  '0x6a4e6f88': 'DopexV2OptionMarket - Invalid pool.',
  '0x2a0c1a97': 'DopexV2OptionMarket - Maximum cost allowance exceeded.',
  '0xcd0e1baa': 'DopexV2OptionMarket - Maximum option buy reached.',
  '0xa971c8f5': 'DopexV2OptionMarket - Not approved settler.',
  '0xa465fc7e': 'DopexV2OptionMarket - Not enough after swap.',
  '0x29e160ee': 'DopexV2OptionMarket - Not an IV setter.',
  '0x023d5f76': 'DopexV2OptionMarket - Not owner or delegator.',
  '0xe554c572': 'DopexV2OptionMarket - Not a valid strike tick.',
  '0x50bb161e': 'DopexV2OptionMarket - Option has expired.',
  '0xa3980a9d': 'DopexV2OptionMarket - Option has not expired.',
  '0xb87edc4e': 'DopexV2OptionMarket - Pool not approved.',

  // DopexV2PositionManager errors
  '0x07608f1d': 'DopexV2PositionManage - Not a whitelisted handler.',
  '0xb967c2d0': 'DopexV2PositionManage - Not a whitelisted app.',
};

export { errorMessages };
