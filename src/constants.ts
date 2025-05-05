type TransformString<S extends string> = S extends `${infer Head} ${infer Tail}`
  ? `${TransformString<Head>}-${TransformString<Tail>}`
  : S;

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

export const SERIES_TYPES = (['Specific day'] as const).map((type) => ({
  label: type,
  value: type.toLowerCase().replace(/\s/g, '-') as TransformString<
    Lowercase<typeof type>
  >,
}));

export type AddMode = 'series' | 'occurrence';
