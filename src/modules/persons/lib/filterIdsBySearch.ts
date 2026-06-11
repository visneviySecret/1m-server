export function filterIdsBySearch(ids: string[], search?: string) {
  if (search === undefined) {
    return ids;
  }

  return ids.filter((id) => id.includes(search));
}
