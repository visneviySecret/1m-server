import { findPersons } from "./persons.repository.js";
import type { GetPersonsParams } from "./persons.types.js";

export async function getPersons(params: GetPersonsParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(1000, Math.max(1, Number(params.limit) || 20));
  const offset = (page - 1) * limit;

  return findPersons(limit, offset, params.selected);
}
