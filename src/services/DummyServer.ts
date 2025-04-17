import type { Entry, IEntryService } from "../schemas/FinanceEntry";

export default class LoggingStorage implements IEntryService {
  constructor() {
    console.log('Dummy server started');
  }
  toggle(id: number): Promise<void> {
    console.log('Dummy server toggling entry', id);
    return Promise.resolve();
  }
  delete(id: number): Promise<void> {
    console.log('Dummy server deleting entry', id);
    return Promise.resolve();
  }
  update(id: number, entry: Entry): Promise<void> {
    console.log('Dummy server updating entry', id, entry);
    return Promise.resolve();
  }

  add(entry: Entry): Promise<void> {
    console.log('Dummy server adding entry', entry);
    return Promise.resolve();
  }

  getAll(): Promise<Entry[]> {
    console.log('Dummy server getting all entries');
    return Promise.resolve([]);
  }

}
