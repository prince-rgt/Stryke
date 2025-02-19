export const LimitOrdersAbi = [
  {
    type: 'function',
    name: 'cancel',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_signature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'computeDigest',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      { name: 'fields', type: 'bytes1', internalType: 'bytes1' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'version', type: 'string', internalType: 'string' },
      { name: 'chainId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'verifyingContract',
        type: 'address',
        internalType: 'address',
      },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: 'extensions',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'exerciseOption',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_signature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
      {
        name: '_exerciseParams',
        type: 'tuple',
        internalType: 'struct IOptionMarket.ExerciseOptionParams',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'swapper',
            type: 'address[]',
            internalType: 'contract ISwapper[]',
          },
          {
            name: 'swapData',
            type: 'bytes[]',
            internalType: 'bytes[]',
          },
          {
            name: 'liquidityToExercise',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
        ],
      },
    ],
    outputs: [{ name: 'comission', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fillOffer',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_signature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getOrderSigner',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_signature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOrderStructHash',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'isOrderCancelled',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'matchOrders',
    inputs: [
      {
        name: '_makerOrder',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_takerOrder',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_makerSignature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
      {
        name: '_takerSignature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
    ],
    outputs: [{ name: 'comission', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'multicall',
    inputs: [{ name: 'data', type: 'bytes[]', internalType: 'bytes[]' }],
    outputs: [{ name: 'results', type: 'bytes[]', internalType: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onERC721Received',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'purchaseOption',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: '_signature',
        type: 'tuple',
        internalType: 'struct ILimitOrders.Signature',
        components: [
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
          { name: 'v', type: 'uint8', internalType: 'uint8' },
        ],
      },
      {
        name: '_opTicks',
        type: 'tuple[]',
        internalType: 'struct IOptionMarket.OptionTicks[]',
        components: [
          {
            name: '_handler',
            type: 'address',
            internalType: 'contract IHandler',
          },
          {
            name: 'pool',
            type: 'address',
            internalType: 'contract IUniswapV3Pool',
          },
          { name: 'hook', type: 'address', internalType: 'address' },
          { name: 'tickLower', type: 'int24', internalType: 'int24' },
          { name: 'tickUpper', type: 'int24', internalType: 'int24' },
          {
            name: 'liquidityToUse',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [{ name: 'cache', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'EIP712DomainChanged',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogExerciseOrderFilled',
    inputs: [
      {
        name: 'order',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'comission',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'executor',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogFillOffer',
    inputs: [
      {
        name: 'order',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'executor',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogOrderCancelled',
    inputs: [
      {
        name: 'order',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogOrdersMatched',
    inputs: [
      {
        name: 'makerOrder',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'takerOrder',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'comission',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'executor',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogPurchasedOrderFilled',
    inputs: [
      {
        name: 'order',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ILimitOrders.Order',
        components: [
          {
            name: 'createdAt',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'maker', type: 'address', internalType: 'address' },
          {
            name: 'validator',
            type: 'address',
            internalType: 'address',
          },
          { name: 'flags', type: 'uint32', internalType: 'uint32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'comission',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'executor',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'InvalidShortString', inputs: [] },
  {
    type: 'error',
    name: 'LimitOrders__InvalidFullfillment',
    inputs: [],
  },
  { type: 'error', name: 'LimitOrders__OrderCancelled', inputs: [] },
  { type: 'error', name: 'LimitOrders__OrderExpired', inputs: [] },
  {
    type: 'error',
    name: 'LimitOrders__OrderRequirementsNotMet',
    inputs: [],
  },
  {
    type: 'error',
    name: 'LimitOrders__SignerOrderMismatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'LimitOrders__VerificationFailed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'StringTooLong',
    inputs: [{ name: 'str', type: 'string', internalType: 'string' }],
  },
] as const;
