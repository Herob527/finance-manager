import Dexie, { type EntityTable } from 'dexie';
import type {
  FinanceEntry,
  FinanceRepository,
  ObservableData,
} from '../types/FinanceEntry';
import type { Observable } from 'rxjs';

import { liveQuery } from 'dexie';
import { from, map, catchError, of } from 'rxjs';

type DexieStore = Dexie & {
  entries: EntityTable<FinanceEntry, 'id'>;
};

export default class IndexedDBStorage implements FinanceRepository {
  readonly type = 'IndexedDB';

  private readonly db: DexieStore;

  private readonly DB_VERSION = 1;

  constructor() {
    const db = new Dexie('FinanceDB') as DexieStore;
    db.version(this.DB_VERSION).stores({
      entries: '++id, amount, date, description, category, enabled',
    });
    this.db = db;
  }
  async add(entries: FinanceEntry[]): Promise<void> {
    const promises = entries.map((entry) => this.db.entries.add(entry));
    const settled = await Promise.allSettled(promises);
    const rejected = settled.filter((result) => result.status === 'rejected');
    if (rejected.length > 0) {
      throw new Error(`${rejected.length} entries failed to add`, {
        cause: rejected,
      });
    }
  }

  async getAll(): Promise<FinanceEntry[]> {
    return this.db.entries.toArray();
  }

  async update(id: number, entry: FinanceEntry): Promise<void> {
    await this.db.entries.update(id, entry);
  }

  async delete(id: number): Promise<void> {
    await this.db.entries.delete(id);
  }

  async toggle(id: number): Promise<void> {
    const entry = await this.db.entries.get(id);
    if (!entry) throw new Error(`FinanceEntry with id ${id} not found`);
    await this.db.entries.update(id, {
      ...entry,
      enabled: !(entry.enabled ?? true),
    });
  }
  observe(): Observable<ObservableData> {
    const observable = from(liveQuery(async () => await this.getAll())).pipe(
      map((result) => ({
        data: result,
        isLoading: false,
        error: null,
      })),
      catchError((error) =>
        of({
          data: [],
          isLoading: false,
          error,
        }),
      ),
    );
    return observable;
  }
}
