import { getPool } from "../../database/db.js";
import type { Person, PersonsPage } from "./persons.types.js";

export async function findPersons(
  limit: number,
  offset: number,
  selected: boolean,
  id?: number
): Promise<PersonsPage> {
  const conditions = ["selected = ?"];
  const params: (boolean | number)[] = [selected];

  if (id !== undefined) {
    conditions.push("id = ?");
    params.push(id);
  }

  const [rows] = await getPool().query(
    `SELECT id, age, name, selected FROM persons WHERE ${conditions.join(" AND ")} ORDER BY id LIMIT ? OFFSET ?`,
    [...params, limit + 1, offset]
  );

  const persons = rows as Person[];
  const hasNext = persons.length > limit;

  return {
    items: persons.slice(0, limit),
    hasNext,
  };
}
