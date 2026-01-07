export const toTitleCase = (str = "") =>
  str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
