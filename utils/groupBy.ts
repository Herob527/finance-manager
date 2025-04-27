// Suggested by claude
function groupByItems<T, K extends PropertyKey>(
  items: Iterable<T>,
  keySelector: (item: T) => K,
): Record<K, T[]> {
  // @ts-expect-error - Using native Object.groupBy but ignoring TypeScript errors
  return Object.groupBy(items, keySelector);
}

export default groupByItems;
