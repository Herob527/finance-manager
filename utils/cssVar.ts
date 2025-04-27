const cssVar = (name: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

export default cssVar;
