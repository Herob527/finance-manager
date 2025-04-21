import { useNuxtApp } from 'nuxt/app';
import type { FinanceRepository } from '../src/types/FinanceEntry';

export const useDatabase = () => {
  const { $storage } = useNuxtApp();
  return $storage as FinanceRepository;
};
