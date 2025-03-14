import { BUILD_APP_NAMES, SupportedChainIdType, TokenData } from '@/types';

import { Address, checksumAddress, getAddress, Hex, zeroAddress } from 'viem';
import { arbitrum, arbitrumSepolia, base, berachainTestnetbArtio, blast, mantle, sonic } from 'wagmi/chains';

import CLPool from '@/abi/CLPool';
import EqualizerPool from '@/abi/EqualizerPool';
import UniswapV3Pool from '@/abi/UniswapV3Pool';

export const SUPPORTED_TTLS = [3600, 7200, 21600, 43200, 86400];

export const AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID = {
  [arbitrum.id]: '0xb223eD797742E096632c39d1b2e0c313750B25FE' as Address,
  [mantle.id]: '0x39d8AD7f378266dD995EEea3B87C7C7EC7Da7490' as Address,
  [base.id]: '0x872C7AC60F27Ffd76c5BC3F2FE7EF9da59659818' as Address,
  [blast.id]: '0xc0941da9731aC05ED523fefd7271222D1D89ad8e' as Address,
  [berachainTestnetbArtio.id]: '0x13927E140eC2443E5358615ee81394DFD8318cD0' as Address,
  [sonic.id]: '0xC57175761E91D38A45E70820613551C855b700EF' as Address,
};

export const POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID = {
  [arbitrum.id]: '0x5eE223AcD61E744458b4d1bB1e24F64F243Cf28E' as Address,
  [mantle.id]: '0xE4bA6740aF4c666325D49B3112E4758371386aDc' as Address,
  [base.id]: '0x99fF939Ef399f5569d57868d43118e6586F574d9' as Address,
  [blast.id]: '0x99fF939Ef399f5569d57868d43118e6586F574d9' as Address,
  [berachainTestnetbArtio.id]: '0xB6c298A1ba27808D6B618f5CAaAB290f0180513b' as Address,
  [sonic.id]: '0xa8C29FD16c272092b4361804736B4f7193a61c92' as Address,
};

export enum SupportedTTLs {
  INTRADAY = 'Intraday',
  WEEKLY = 'Weekly',
}

export const HOOKS_BY_CHAIN_ID = {
  [arbitrum.id]: {
    [SupportedTTLs.INTRADAY]: ['0x8c30c7F03421D2C9A0354e93c23014BF6C465a79'] as Address[],

    [SupportedTTLs.WEEKLY]: [
      '0x0fC0744eACe0aEA3c3CF91FDF5b4A5428533aA3A',
      // update zeroAddress wen OrangeFinace fixes it
      zeroAddress,
    ] as Address[],
  },
  [mantle.id]: {
    [SupportedTTLs.INTRADAY]: ['0xe68Db25857261874359bC5CFB8D04C0C012ac24C'] as Address[],
    [SupportedTTLs.WEEKLY]: ['0xff41642C69a1FFcC29E541e777CC73717A209Fa9'] as Address[],
  },
  [base.id]: {
    [SupportedTTLs.INTRADAY]: ['0x853ca947d0AD6408aC4f57C507dFcaE151240D2D'] as Address[],
    [SupportedTTLs.WEEKLY]: ['0x4e83CD2C50d270C4Bf264C4C16836047173C08c0'] as Address[],
  },
  [blast.id]: {
    [SupportedTTLs.INTRADAY]: ['0x4e83CD2C50d270C4Bf264C4C16836047173C08c0'] as Address[],
    [SupportedTTLs.WEEKLY]: ['0xfC4508461f24afc99B76Ae580d1A2dec518a70c1'] as Address[],
  },
  [berachainTestnetbArtio.id]: {
    [SupportedTTLs.INTRADAY]: ['0x996182D8Ed557b3bBB4B914ad5Aca425292A37e4'] as Address[],
    [SupportedTTLs.WEEKLY]: ['0x8C31BF7c7C09b6660671a757E1117D84bDa9865c'] as Address[],
  },
  [sonic.id]: {
    [SupportedTTLs.INTRADAY]: ['0x78d96C07B16d8f911c4cD14EE10601921E4fb8aF'] as Address[],
    [SupportedTTLs.WEEKLY]: ['0xf6314300b42B7D88c153348921a95d3CA95E74Bd'] as Address[],
  },
};

export const CLAMM_ROUTER_FRONTEND_ID = '0x14d0eb61e2317f04e6ea905643ba5ccbb19de0bc183fec1ef59414be7d7cb3ec';

export const CLAMM_ROUTER_FE_ID_BY_BUILD_APP: Record<BUILD_APP_NAMES, Hex> = {
  // stryke id
  [BUILD_APP_NAMES.STRYKE]: '0x14d0eb61e2317f04e6ea905643ba5ccbb19de0bc183fec1ef59414be7d7cb3ec',
  // stryke id
  [BUILD_APP_NAMES.KODIAK]: '0x14d0eb61e2317f04e6ea905643ba5ccbb19de0bc183fec1ef59414be7d7cb3ec',
  // stryke id
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: '0x14d0eb61e2317f04e6ea905643ba5ccbb19de0bc183fec1ef59414be7d7cb3ec',
  // pcs id
  [BUILD_APP_NAMES.PANCAKESWAP]: '0xd7e0d5c07ddc27357df5c45737f3b7506ed8b6a6631c211732cdda1dfcf56ba3',
};

export const CLAMM_ROUTER_ADDRESS_BY_CHAIN_ID = {
  [arbitrum.id]: '0x2dD8BF6bf68dD903F32B9dEfB20443305D301fA6' as Address,
  [mantle.id]: '0xb1eF5f36cBa3e741F8264BcfaCeF590686FDfE68' as Address,
  [base.id]: '0x8C4D42ACdAf0dea678B02A092276E2313eD7D820' as Address,
  [blast.id]: '0x1Bfa26a0dc850B3a9B7586Cc6f8f868B5204a3F1' as Address,
  [berachainTestnetbArtio.id]: '0x642a787392380BB7118c32CB1cB49E9005600cd9' as Address,
  [sonic.id]: '0x9FD06bb305d74C85961CE2307dab72b07d06606F' as Address,
};

export enum AMMs {
  FUSION_X = 'Fusion X',
  AGNI = 'Agni',
  BUTTER = 'Butter',
  UNISWAP = 'Uniswap V3',
  PANCAKESWAP = 'Pancakeswap V3',
  SUSHI = 'Sushiswap V3',
  THRUSTER = 'Thruster',
  KODIAK = 'Kodiak',
  AERODROME = 'Aerodrome',
  EQUALIZER = 'Equalizer',
}

export const AMMs_BY_CHAIN_ID = {
  [arbitrum.id]: [AMMs.PANCAKESWAP, AMMs.SUSHI, AMMs.UNISWAP],
  [mantle.id]: [AMMs.FUSION_X, AMMs.AGNI],
  [base.id]: [AMMs.AERODROME, AMMs.UNISWAP],
  [blast.id]: [AMMs.THRUSTER],
  [berachainTestnetbArtio.id]: [AMMs.KODIAK],
  [sonic.id]: [AMMs.EQUALIZER /*, AMMs.SUSHI */],
};

// @note currently only aerodrome has a different abi signature for slot0(), hence uniswap-v3 abi is used for other pools
export const POOL_TO_ABI = {
  [arbitrum.id]: {
    // pcs weth/usdc, wbtc/usdc, arb/usdc
    [checksumAddress('0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c')]: UniswapV3Pool,
    [checksumAddress('0x9fFCA51D23Ac7F7df82da414865Ef1055E5aFCc3')]: UniswapV3Pool,
    [checksumAddress('0x843ac8dc6d34aeb07a56812b8b36429ee46bdd07')]: UniswapV3Pool,
    // sushi weth/usdc, wbtc/usdc, arb/usdc
    [checksumAddress('0xf3Eb87C1F6020982173C908E7eB31aA66c1f0296')]: UniswapV3Pool,
    [checksumAddress('0x699f628a8a1de0f28cf9181c1f8ed848ebb0bbdf')]: UniswapV3Pool,
    [checksumAddress('0xfa1cc0cae7779b214b1112322a2d1cf0b511c3bc')]: UniswapV3Pool,
    // uniswap weth/usdc, wbtc/usdc, arb/usdc
    [checksumAddress('0xc6962004f452be9203591991d15f6b388e09e8d0')]: UniswapV3Pool,
    [checksumAddress('0x0e4831319a50228b9e450861297ab92dee15b44f')]: UniswapV3Pool,
    [checksumAddress('0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8')]: UniswapV3Pool,
    [checksumAddress('0xe24f62341d84d11078188d83ca3be118193d6389')]: UniswapV3Pool,
  },
  [arbitrumSepolia.id]: {
    [checksumAddress('0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA')]: UniswapV3Pool,
  },
  [base.id]: {
    // degen/weth, brett/weth, cbbtc/usdc, weth/usdc
    [checksumAddress('0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA')]: UniswapV3Pool,
    [checksumAddress('0xBA3F945812a83471d709BCe9C3CA699A19FB46f7')]: UniswapV3Pool,
    [checksumAddress('0x4e962BB3889Bf030368F56810A9c96B83CB3E778')]: CLPool,
    [checksumAddress('0xb2cc224c1c9feE385f8ad6a55b4d94E92359DC59')]: CLPool,
  },
  [berachainTestnetbArtio.id]: {
    // honey-usdc, wbera-honey
    [checksumAddress('0x64F18443596880Df5237411591Afe7Ae69f9e9B9')]: UniswapV3Pool,
    [checksumAddress('0x8a960A6e5f224D0a88BaD10463bDAD161b68C144')]: UniswapV3Pool,
  },
  [blast.id]: {
    // blast-usdb
    [checksumAddress('0xE3a5f46667461e35eeCe4E39e2177b438AF6B7f7')]: UniswapV3Pool,
  },
  [mantle.id]: {
    // wmnt-usdt, weth-usdt, wmnt-usdt, weth-usdc
    [checksumAddress('0xD08C50F7E69e9aeb2867DefF4A8053d9A855e26A')]: UniswapV3Pool,
    [checksumAddress('0x628f7131CF43e88EBe3921Ae78C4bA0C31872bd4')]: UniswapV3Pool,
    [checksumAddress('0x262255F4770aEbE2D0C8b97a46287dCeCc2a0AfF')]: UniswapV3Pool,
    [checksumAddress('0x01845ec86909006758DE0D57957D88Da10bf5809')]: UniswapV3Pool,
  },
  [sonic.id]: {
    // aerodrome weth-usdc.e
    [checksumAddress('0xfe809A1D337Bdfc98B77A1067e3819f66d8AD23F')]: EqualizerPool,
    // aerodrome ws-usdc.e
    [checksumAddress('0xb1BC4B830FCbA2184B92e15b9133c41160518038')]: EqualizerPool,
    // sushi ws-usdc.e
    [checksumAddress('0x48505b3047d5c2af657037034369700f4d036822')]: UniswapV3Pool,
  },
};

export const AMM_TO_HANDLER: Record<number, Record<string, Address>> = {
  [arbitrum.id]: {
    [AMMs.PANCAKESWAP]: '0x23aD242c41b965DB6343ec4A9890fcF80da1c314',
    [AMMs.SUSHI]: '0x36dfa3488E2974f003481fc18388fd6a0741A4Be',
    [AMMs.UNISWAP]: '0xdeD9741Cd7B4B8ffc1DbCFEcd84B20D35538FFaf',
  },
  [mantle.id]: {
    [AMMs.AGNI]: '0x5DdA827f304Aeb693573720B344eD160e7D4703C',
    [AMMs.FUSION_X]: '0x210D2963b555Ce5AC7e3d9b0e2F38d7AEBd4B43F',
    // [AMMs.BUTTER]: '0xD648267FC75e144f28436E7b54030C7466031b05',
  },
  [base.id]: {
    [AMMs.UNISWAP]: '0xa51175f9076b2535003ac146921485083ab3a63c',
    [AMMs.AERODROME]: '0x96024E876cA631DaF12cDFe65c04FC5c39B9E35b',
  },
  [blast.id]: {
    [AMMs.THRUSTER]: '0x872C7AC60F27Ffd76c5BC3F2FE7EF9da59659818',
  },
  [berachainTestnetbArtio.id]: {
    [AMMs.KODIAK]: '0x670c817C2C57B78E746f977741C36a663a216C52',
  },
  [sonic.id]: {
    [AMMs.EQUALIZER]: '0x247fcfB55BFC33945A37F289d5Af2a622CBE4500',
    [AMMs.SUSHI]: '0xDDcbD41E80B3BDbe04A79E198022Be7FFa651bff',
  },
};

export const HANDLER_TO_POOLS: Record<
  number,
  Record<string, Record<string, Address | undefined> | undefined> | undefined
> = {
  [mantle.id]: {
    [AMMs.AGNI]: {
      'WMNT-USDT': '0xD08C50F7E69e9aeb2867DefF4A8053d9A855e26A',
      'WETH-USDT': '0x628f7131CF43e88EBe3921Ae78C4bA0C31872bd4',
    },
    [AMMs.FUSION_X]: {
      'WMNT-USDT': '0x262255F4770aEbE2D0C8b97a46287dCeCc2a0AfF',
      // check it is correct w arc
      'WETH-USDC': '0x01845ec86909006758DE0D57957D88Da10bf5809',
    },
    // [AMMs.BUTTER]: {
    //   'WETH-USDT': '0xD801D457D9cC70f6018a62885F03BB70706F59Cc',
    //   'WMNT-USDT': '0x0B15691C828fF6D499375e2ca2070B08Dd62369E',
    // },
  },
  [arbitrum.id]: {
    [AMMs.PANCAKESWAP]: {
      'WETH-USDC': '0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c',
      'ARB-USDC': '0x9fFCA51D23Ac7F7df82da414865Ef1055E5aFCc3',
      'WBTC-USDC': '0x843ac8dc6d34aeb07a56812b8b36429ee46bdd07',
    },
    [AMMs.SUSHI]: {
      'WETH-USDC': '0xf3Eb87C1F6020982173C908E7eB31aA66c1f0296',
      'WBTC-USDC': '0x699f628a8a1de0f28cf9181c1f8ed848ebb0bbdf',
      'ARB-USDC': '0xfa1cc0cae7779b214b1112322a2d1cf0b511c3bc',
    },
    [AMMs.UNISWAP]: {
      'WETH-USDC': '0xc6962004f452be9203591991d15f6b388e09e8d0',
      'WBTC-USDC': '0x0e4831319a50228b9e450861297ab92dee15b44f',
      'ARB-USDC': '0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8',
      'BOOP-WETH': '0xe24f62341d84d11078188d83ca3be118193d6389',
    },
  },
  [base.id]: {
    [AMMs.UNISWAP]: {
      'DEGEN-WETH': '0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA',
      'BRETT-WETH': '0xBA3F945812a83471d709BCe9C3CA699A19FB46f7',
    },
    [AMMs.AERODROME]: {
      'cbBTC-USDC': '0x4e962BB3889Bf030368F56810A9c96B83CB3E778',
      'WETH-USDC': '0xb2cc224c1c9feE385f8ad6a55b4d94E92359DC59',
    },
  },
  [blast.id]: {
    [AMMs.THRUSTER]: {
      'BLAST-USDB': '0xE3a5f46667461e35eeCe4E39e2177b438AF6B7f7',
    },
  },
  [berachainTestnetbArtio.id]: {
    [AMMs.KODIAK]: {
      'HONEY-USDC': '0x64F18443596880Df5237411591Afe7Ae69f9e9B9',
      'WBERA-HONEY': '0x8a960A6e5f224D0a88BaD10463bDAD161b68C144',
    },
  },
  [sonic.id]: {
    [AMMs.EQUALIZER]: {
      'WS-USDC.e': '0xb1BC4B830FCbA2184B92e15b9133c41160518038',
      'WETH-USDC.e': '0xfe809A1D337Bdfc98B77A1067e3819f66d8AD23F',
    },
    [AMMs.SUSHI]: {
      'WS-USDC.e': '0x48505b3047d5c2af657037034369700f4d036822',
    },
  },
};

export const HANDLER_TO_SWAPPER: Record<string, undefined | Record<string, Address>> = {
  [arbitrum.id]: {
    pancakeswap: '0xC482138FB23E97DfF8B411E229f6718eb96fF849',
    uniswap: '0xC482138FB23E97DfF8B411E229f6718eb96fF849',
  },
  [mantle.id]: {
    agni: '0x471923c6148495530C5153040A9D8726213421Bd',
    fusionx: '0x480199183c57853a96BEF4F8e2B0C28dd877c7D8',
    // butter: '0x580bC0591b78c3a255fB908Bff2e1A4633B0c124',
  },
  [blast.id]: {
    thruster: '0x3fF52fbF7153D47714ccD68a335553039060E58D',
  },
  // [base.id]: {
  //   aerodrome: '0x70d0111111111111111111111111111111111111', // @todo update
  // },
};

// @note option market address (key) must be lowercase
export const POOLS_BY_CHAIN_ID = {
  [arbitrum.id]: {
    // WETH - USDC
    '0xcd697b919aa000378fe429b47eb0ff0d17d3d435': [
      // uniswapV3
      '0xc6962004f452be9203591991d15f6b388e09e8d0',
      // pancakeswap
      '0xd9e2a1a61b6e61b275cec326465d417e52c1b95c',
      // sushi
      '0xf3Eb87C1F6020982173C908E7eB31aA66c1f0296',
    ],
    // WBTC - USDC
    '0x502751c59feb16959526f1f8aa767d84b028bfbd': [
      // uniswapV3
      '0x0e4831319a50228b9e450861297ab92dee15b44f',
      // pancakeswap
      '0x843ac8dc6d34aeb07a56812b8b36429ee46bdd07',
      // sushi
      '0x699f628a8a1de0f28cf9181c1f8ed848ebb0bbdf',
    ],
    // ARB - USDC
    '0x20b2431557bb90954744a6d404f45ad1ad8719f4': [
      // uniswapV3
      '0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8',
      // pancakeswap
      '0x9ffca51d23ac7f7df82da414865ef1055e5afcc3',
      // sushi
      '0xfa1cc0cae7779b214b1112322a2d1cf0b511c3bc',
    ],
    // BOOP-WETH
    '0xa23233775ed58669cb0c2c7a6fa0380b6ccc1094': [
      // uniswapV3
      '0xe24f62341d84d11078188d83ca3be118193d6389',
    ],
  },
  [mantle.id]: {
    // wmnt - usdt
    '0x1d5de630bbbf68c9bf17d8462605227d79ea910c': [
      '0xD08C50F7E69e9aeb2867DefF4A8053d9A855e26A', // agni
      '0x262255F4770aEbE2D0C8b97a46287dCeCc2a0AfF', // fusionX
      // '0x0B15691C828fF6D499375e2ca2070B08Dd62369E', // butter
    ],
    // weth - usdc
    '0x50d31b053c3a099b2cae50eb63848eccf87d72df': [
      '0x01845ec86909006758DE0D57957D88Da10bf5809', // fusionX
      // '0xB301c86b37801ee31448fE09EF271279f6F0B068', // butter
    ],
    // weth - usdt
    '0xcda890c42365dcb1a8a1079f2f47379ad620bc99': [
      '0x628f7131CF43e88EBe3921Ae78C4bA0C31872bd4', // agni
      // '0xD801D457D9cC70f6018a62885F03BB70706F59Cc', // butter
    ],
  },
  [base.id]: {
    // DEGEN - WETH
    '0x10f95fa355f2c2c44afa975b784ff88443fe21dc': [
      // uniswapV3
      '0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA',
    ],
    // BRETT - WETH
    '0x849f74700b0714c6b87680f7af49b72677298d86': [
      // uniswapV3
      '0xBA3F945812a83471d709BCe9C3CA699A19FB46f7',
    ],
    // weth-usdc optionMarket
    '0x9fd06bb305d74c85961ce2307dab72b07d06606f': [
      // aerodrome weth-usdc pool
      '0xb2cc224c1c9feE385f8ad6a55b4d94E92359DC59',
    ],
    // cbbtc-usdc optionMarket
    '0x499218af9349bf35e70bf72d157cc8ebd291a7c3': [
      // aerodrome cbwbtc-usdc pool
      '0x4e962BB3889Bf030368F56810A9c96B83CB3E778',
    ],
  },
  [blast.id]: {
    // BLAST - USDB
    '0x40211ac3637f342c964b4a1a24b3e997f217e8da': [
      // thruster
      '0xE3a5f46667461e35eeCe4E39e2177b438AF6B7f7',
    ],
  },
  [berachainTestnetbArtio.id]: {
    // HONEY - USDC
    '0xc2a777a76381a1e42416e4e5140892ff4471de52': [
      // kodiak
      '0x8a960A6e5f224D0a88BaD10463bDAD161b68C144',
    ],
  },

  [sonic.id]: {
    // WS - USDC.e
    '0x342e4068ba07bbccbdde503b2451faa3d3c0278b': [
      // equalizer
      getAddress('0xb1BC4B830FCbA2184B92e15b9133c41160518038'),
      // sushi
      getAddress('0x48505b3047d5c2af657037034369700f4d036822'),
    ],
    // WETH - USDC.e
    '0x9d3828e89fadc4dec77758988b388435fe0f8dca': [getAddress('0xfe809A1D337Bdfc98B77A1067e3819f66d8AD23F')],
  },
};

export const INCENTIVIZED_POOLS: {
  [key in SupportedChainIdType]:
    | { [key in Address]: { tokens: Omit<TokenData, 'logoURI' | 'chainId' | 'name'>[]; rewardRange: number } }
    | null;
} = {
  [arbitrum.id]: null,
  [arbitrumSepolia.id]: null,
  //  {
  //   [checksumAddress('0xc6962004f452be9203591991d15f6b388e09e8d0')]: {
  //     tokens: [
  //       { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, symbol: 'ARB' },
  //       // { address: '0x50E04E222Fc1be96E94E86AcF1136cB0E97E1d40', decimals: 18, symbol: 'XSYK' }, // currently not actively distributed
  //     ],
  //     rewardRange: 0.1, // 10%
  //   },
  //   [checksumAddress('0x0e4831319a50228b9e450861297ab92dee15b44f')]: {
  //     tokens: [
  //       { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, symbol: 'ARB' },
  //       // { address: '0x50E04E222Fc1be96E94E86AcF1136cB0E97E1d40', decimals: 18, symbol: 'XSYK' }, // currently not actively distributed
  //     ],
  //     rewardRange: 0.1, // 10%
  //   },
  //   [checksumAddress('0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8')]: {
  //     tokens: [
  //       { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, symbol: 'ARB' },
  //       // { address: '0x50E04E222Fc1be96E94E86AcF1136cB0E97E1d40', decimals: 18, symbol: 'XSYK' }, // currently not actively distributed
  //     ],
  //     rewardRange: 0.1, // 10%
  // },

  [mantle.id]: null,
  [base.id]: null,
  [sonic.id]: null,
  [blast.id]: null,
  [berachainTestnetbArtio.id]: null,
};

/** LIMIT ORDERS */
export const LIMIT_EXERCICSE_MARKET_ONLY_FLAG = 272; // 0x00000110
export const LIMIT_EXERCISE_MARKET_ONLY_FLAG_HEX = '0x00000' + LIMIT_EXERCICSE_MARKET_ONLY_FLAG.toString(16);
export const LIMIT_ORDERS_CONTRACT_NAME = 'Stryke Limit Orders';
export const LIMIT_ORDERS_CONTRACT_VERSION = '1';

export const LIMIT_ORDERS_CONTRACT_BY_CHAIN_ID: Record<number, Address> = {
  [arbitrum.id]: '0x91e45D19861049f98bD9520042283Be9C7F960B5',
  [arbitrumSepolia.id]: '0x91e45D19861049f98bD9520042283Be9C7F960B5',
  [mantle.id]: '0x71a26Cd2034302422ce9F567A36B5b1F8AD665f7',
  [blast.id]: '0x22E5d4e35a275524563B7B3cae1b062Bc6406F0B',
  [base.id]: '0x5b064dFC69527302024BE6D15c0C7aE2e3875166',
  [sonic.id]: '0x7Ab147BEfab9801B4644485a5d963E7eA26128a4',
};

export const OVERRIDDEN_MARKET_DECIMALS = {
  // override decimals on pool basis
  [checksumAddress('0x8a960A6e5f224D0a88BaD10463bDAD161b68C144')]: 5, // wbera-honey
};

export const MULTICALL_LIMIT_BY_CHAIN: Record<number, number> = {
  [arbitrum.id]: 40,
  [arbitrumSepolia.id]: 40,
  [mantle.id]: 40,
  [base.id]: 40,
  [blast.id]: 40,
  [berachainTestnetbArtio.id]: 40,
  [sonic.id]: 20, // ~23 mintPositions
};
