export const CATEGORIES = (
  ['Groceries', 'Utilities', 'Entertainment', 'Other', 'Job'] as const
).map((c) => ({ value: c.toLowerCase() as Lowercase<typeof c>, label: c }));
