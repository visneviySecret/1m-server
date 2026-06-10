import type { ParsedPersonsQuery, PersonsQueryParams } from "../persons.types.js";

export function parsePersonsQuery(params: PersonsQueryParams): ParsedPersonsQuery {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(1000, Math.max(1, Number(params.limit) || 20));
  const id =
    params.id !== undefined &&
    params.id !== null &&
    String(params.id).trim() !== ""
      ? String(params.id).trim()
      : undefined;

  const query: ParsedPersonsQuery = {
    page,
    limit,
    offset: (page - 1) * limit,
  };

  if (id !== undefined) {
    query.id = id;
  }

  return query;
}
