interface Entry {
  id: number;
  amount: number; // Expense is just negative
  date: Date;
  description: string;
  category: string;
  enabled: boolean;
}
export interface IEntryService {
  add(entry: Entry): Promise<number>;
  getAll(): Promise<Entry[]>;
  update(id: number, entry: Entry): Promise<void>;
  delete(id: number): Promise<void>;
  toggle(id: number): Promise<void>;
}
