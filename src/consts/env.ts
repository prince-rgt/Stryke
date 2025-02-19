import { BUILD_APP_NAMES, Env } from '@/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const VARROCK_BASE_API_URL = process.env.NEXT_PUBLIC_VARROCK_API_BASE_URL;

export const DRPC_API_KEY = process.env.NEXT_PUBLIC_DRPC_API_KEY;

export const AUTH_BEARER_TOKEN = process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN;

export const SPINDL_SDK_KEY = process.env.NEXT_PUBLIC_SPINDL_SDK_KEY;

export const ACTIVATE_SPINDL = process.env.NEXT_PUBLIC_ACTIVATE_SPINDL === 'true';

export const NODE_ENV = process.env.NODE_ENV;

export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

export const TENDERLY_ACCOUNT_SLUG = process.env.NEXT_PUBLIC_TENDERLY_ACCOUNT_SLUG;

export const TENDERLY_PROJECT_SLUG = process.env.NEXT_PUBLIC_TENDERLY_PROJECT_SLUG;

export const GAUGES_SUBGRAPH_URL = process.env.NEXT_PUBLIC_GAUGES_SUBGRAPH_URL;

export const BUILD_APP_NAME = (process.env.NEXT_PUBLIC_BUILD_APP_NAME as BUILD_APP_NAMES) || BUILD_APP_NAMES.STRYKE;
