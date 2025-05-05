export const CATEGORIES = (
  [
    'Groceries',
    'Health',
    'Utilities',
    'Entertainment',
    'Saving',
    'Job',
    'Investments',
    'Sport',
    'Housing',
    'Phone',
    'Debt',
    'Other',
  ] as const
).map((c) => ({ value: c.toLowerCase() as Lowercase<typeof c>, label: c }));

export type AddMode = 'series' | 'occurrence';
