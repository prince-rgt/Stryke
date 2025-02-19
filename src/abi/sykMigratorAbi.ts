const sykMigratorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_dpx', type: 'address', internalType: 'address' },
      { name: '_rdpx', type: 'address', internalType: 'address' },
      { name: '_syk', type: 'address', internalType: 'address' },
      {
        name: '_initialAuthority',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'authority',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'dpx',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'dpxConversionRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'extendMigrationPeriod',
    inputs: [{ name: '_extendBy', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isConsumingScheduledOp',
    inputs: [],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'migrate',
    inputs: [
      { name: '_token', type: 'address', internalType: 'address' },
      { name: '_amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'migrationPeriodEnd',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rdpx',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rdpxConversionRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'recoverERC20',
    inputs: [{ name: '_tokens', type: 'address[]', internalType: 'address[]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setAuthority',
    inputs: [{ name: 'newAuthority', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'syk',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AuthorityUpdated',
    inputs: [
      {
        name: 'authority',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ERC20Recovered',
    inputs: [
      {
        name: 'tokens',
        type: 'address[]',
        indexed: false,
        internalType: 'address[]',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Migrate',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MigrationPeriodExtended',
    inputs: [
      {
        name: 'newMigrationPeriodEnd',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'extendBy',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AccessManagedInvalidAuthority',
    inputs: [{ name: 'authority', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AccessManagedRequiredDelay',
    inputs: [
      { name: 'caller', type: 'address', internalType: 'address' },
      { name: 'delay', type: 'uint32', internalType: 'uint32' },
    ],
  },
  {
    type: 'error',
    name: 'AccessManagedUnauthorized',
    inputs: [{ name: 'caller', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  { type: 'error', name: 'InvalidToken', inputs: [] },
  { type: 'error', name: 'MigrationPeriodNotOver', inputs: [] },
  { type: 'error', name: 'MigrationPeriodOver', inputs: [] },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
  },
] as const;

export default sykMigratorAbi;
