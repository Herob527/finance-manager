import type { Observable } from 'rxjs';

export interface FinanceEntry {
  id: number;
  amount: number; // Expense is just negative
  date: Date;
  description: string;
  category: string;
  enabled: boolean;
}

export interface ObservableData {
  data: FinanceEntry[];
  isLoading: boolean;
  error: unknown;
}

export interface FinanceRepository {
  add(entry: Omit<FinanceEntry, 'id'>[]): Promise<void>;
  getAll(): Promise<FinanceEntry[]>;
  update(id: number, entry: FinanceEntry): Promise<void>;
  delete(id: number): Promise<void>;
  toggle(id: number): Promise<void>;
  observe(): Observable<ObservableData>;
}
