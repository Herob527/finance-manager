import { Observable } from 'rxjs';
import type {
  FinanceEntry,
  FinanceRepository,
  ObservableData,
  SeriesParam,
} from '../types/FinanceEntry';

export default class LoggingStorage implements FinanceRepository {
  constructor() {
    console.log('Dummy server started');
  }
  addSeries(
    entry: Omit<FinanceEntry, 'id'>,
    params: SeriesParam,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  toggle(id: number): Promise<void> {
    console.log('Dummy server toggling entry', id);
    return Promise.resolve();
  }
  delete(id: number): Promise<void> {
    console.log('Dummy server deleting entry', id);
    return Promise.resolve();
  }
  update(id: number, entry: FinanceEntry): Promise<void> {
    console.log('Dummy server updating entry', id, entry);
    return Promise.resolve();
  }

  add(entry: FinanceEntry[]): Promise<void> {
    console.log('Dummy server adding entry', entry);
    return Promise.resolve();
  }

  getAll(): Promise<FinanceEntry[]> {
    console.log('Dummy server getting all entries');
    return Promise.resolve([]);
  }
  observe(): Observable<ObservableData> {
    return new Observable((observer) => {
      observer.next({
        data: [],
        isLoading: false,
        error: null,
      });
    });
  }
}
