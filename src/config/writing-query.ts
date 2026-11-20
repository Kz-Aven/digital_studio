export function normalizeWritingSearch(text: string) {
  return text.normalize('NFKC').toLowerCase().trim();
}

export function writingMatchesQuery(searchableText: string, query: string) {
  const text = normalizeWritingSearch(searchableText);
  return normalizeWritingSearch(query).split(/\s+/).every((word) => text.includes(word));
}
