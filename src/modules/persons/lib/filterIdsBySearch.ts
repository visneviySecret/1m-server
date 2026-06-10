export function filterIdsBySearch(ids: number[], search?: string) {
  if (search === undefined) {
    return ids;
  }

  return ids.filter((id) => String(id).includes(search));
}
