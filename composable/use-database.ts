import { useNuxtApp } from "nuxt/app";
import type { IEntryService } from "../src/schemas/FinanceEntry";

export const useDatabase = () => {
  const { $storage } = useNuxtApp();
  return $storage as IEntryService
}
