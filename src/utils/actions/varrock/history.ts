import { HistoricDeposit, HistoricExercise, HistoricPurchase, HistoricWithdraw } from '@/types/varrock';

import {
  DepositHistoryRequestDto,
  ExerciseHistoryRequestDto,
  GetSettlementsDto,
  PurchaseHistoryRequestDto,
  SettlementsDto,
  WithdrawHistoryRequestDto,
} from '@stryke-xyz/shared-types';
import axios from 'axios';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export async function getHistoricPurchases(params: PurchaseHistoryRequestDto): Promise<HistoricPurchase[]> {
  return await axios
    .get<HistoricPurchase[]>(
      `${VARROCK_BASE_API_URL}/clamm/purchase/history?chainId=${params.chainId}&optionMarket=${params.optionMarket}&first=${params.first}&skip=${params.skip}&user=${params.user}`,
    )
    .then((res) => res.data)
    .catch((err) => {
      if (!err || !err.response || !err.response.data || !err.response.data.message) {
        // console.error(err);
        return [] as HistoricPurchase[];
      }
      return [] as HistoricPurchase[];
    });
}

export async function getHistoricDeposits(params: DepositHistoryRequestDto): Promise<HistoricDeposit[]> {
  return await axios
    .get<HistoricDeposit[]>(
      `${VARROCK_BASE_API_URL}/clamm/deposit/history?chainId=${params.chainId}&pool=${params.pool}&first=${params.first}&skip=${params.skip}&user=${params.user}`,
    )
    .then((res) => res.data)
    .catch((_) => [] as HistoricDeposit[]);
}

export async function getHistoricExercises(params: ExerciseHistoryRequestDto): Promise<HistoricExercise[]> {
  return await axios
    .get<HistoricExercise[]>(
      `${VARROCK_BASE_API_URL}/clamm/exercise/history?chainId=${params.chainId}&optionMarket=${params.optionMarket}&first=${params.first}&skip=${params.skip}&user=${params.user}`,
    )
    .then((res) => res.data)
    .catch((_) => [] as HistoricExercise[]);
}

export async function getHistoricSettlements(params: GetSettlementsDto): Promise<SettlementsDto[]> {
  return await axios
    .get<SettlementsDto[]>(
      `${VARROCK_BASE_API_URL}/clamm/settlements/history?chainId=${params.chainId}&optionMarket=${params.optionMarket}&first=${params.first}&skip=${params.skip}&user=${params.user}`,
    )
    .then((res) => res.data)
    .catch((_) => [] as SettlementsDto[]);
}

export async function getHistoricWithdrawals(params: WithdrawHistoryRequestDto): Promise<HistoricWithdraw[]> {
  return await axios
    .get<HistoricWithdraw[]>(
      `${VARROCK_BASE_API_URL}/clamm/withdraw/history?chainId=${params.chainId}&pool=${params.pool}&first=${params.first}&skip=${params.skip}&user=${params.user}`,
    )
    .then((res) => res.data)
    .catch((_) => [] as HistoricWithdraw[]);
}
