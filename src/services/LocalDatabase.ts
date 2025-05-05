import Dexie, { type EntityTable } from 'dexie';
import type {
  FinanceEntry,
  FinanceRepository,
  ObservableData,
  SeriesParam,
} from '../types/FinanceEntry';
import type { Observable } from 'rxjs';

import { liveQuery } from 'dexie';
import { from, map, catchError, of } from 'rxjs';
import { DateTime } from 'luxon';

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

  // Series occurs monthly for the time being
  async addSeries(
    entry: Omit<FinanceEntry, 'id'>,
    params: SeriesParam,
  ): Promise<void> {
    const { end } = params;
    const { date: start } = entry;
    if (start > end) {
      throw new Error('Start date must be before end date');
    }
    const endDate = DateTime.fromJSDate(end);
    const startDate = DateTime.fromJSDate(start);
    const monthDiff = endDate.diff(startDate, 'months').months;
    console.log(monthDiff);
    const data = Array(Math.trunc(monthDiff))
      .fill(0)
      .map((_, i) => ({
        ...entry,
        date: startDate.plus({ months: i }).toJSDate(),
      }));
    console.log(data);
    await this.db.entries.bulkAdd(data);
  }

  async add(entries: FinanceEntry[]): Promise<void> {
    await this.db.entries.bulkAdd(entries);
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
