# CONCEPT

## App Sections

- Graph representing monthly income and expenses and prediction
- Calendar summary
- Add expenses and incomes

## Data store

- Local-first so use IndexedDB (use Dexie)

```ts
interface Entry {
  amount: number; // Expense is just negative
  date: Date;
  description: string;
  category: string;
  enabled: boolean;
}
```
