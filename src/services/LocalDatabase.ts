import type { Entry, IEntryService } from "../schemas/FinanceEntry";
import Dexie, { type EntityTable } from "dexie";

type DexieStore = Dexie & {
  entries: EntityTable<Entry, 'id'>;
}


export default class IndexedDBStorage implements IEntryService {
  readonly type = "IndexedDB"

  private readonly db: DexieStore;

  private readonly DB_VERSION = 1


  constructor() {
    const db = new Dexie("FinanceDB") as DexieStore;
    db.version(this.DB_VERSION).stores({
      entries: "++id, amount, date, description, category, enabled"
    });
    this.db = db
  }
  async add(entry: Entry): Promise<void> {
    await this.db.entries.add(entry)
  }

  async getAll(): Promise<Entry[]> {
    return this.db.entries.toArray()
  }

  async update(id: number, entry: Entry): Promise<void> {
    await this.db.entries.update(id, entry)
  }

  async delete(id: number): Promise<void> {
    await this.db.entries.delete(id)
  }

  async toggle(id: number): Promise<void> {
    const entry = await this.db.entries.get(id)
    if (!entry) throw new Error(`Entry with id ${id} not found`)
    entry.enabled = entry?.enabled ?? true
    await this.db.entries.update(id, entry)
  }

}
