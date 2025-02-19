import { Address } from 'viem';

const SUPPORTED_XSYK_CHAINS = [42161] as const;

const VEDPX: Address = '0x80789D252A288E93b01D82373d767D71a75D9F16';
const SYK_ADDR: Address = '0xACC51FFDeF63fB0c014c882267C3A17261A5eD50'; // arb-only
const XSYK_ADDR_BY_CHAIN: Record<number, Address> = { 42161: '0x50e04e222fc1be96e94e86acf1136cb0e97e1d40' }; // cross-chain
const XSYK_STAKING_BY_CHAIN: Record<number, Address> = { 42161: '0x8263A867eF2d952a3fC0c7cD3cE0895Db30cEb4B' }; // cross-chain

export { SUPPORTED_XSYK_CHAINS, VEDPX, SYK_ADDR, XSYK_ADDR_BY_CHAIN, XSYK_STAKING_BY_CHAIN };
