import { getPool } from "../../database/db.js";
import type { Person, PersonsPage } from "./persons.types.js";

export async function findPersons(
  limit: number,
  offset: number,
  selected: boolean,
  id?: string
): Promise<PersonsPage> {
  const conditions = ["selected = ?"];
  const params: (boolean | number | string)[] = [selected];

  if (id !== undefined) {
    conditions.push("CAST(id AS CHAR) LIKE ?");
    params.push(`%${id}%`);
  }

  const [rows] = await getPool().query(
    `SELECT id, age, name, selected FROM persons WHERE ${conditions.join(
      " AND "
    )} ORDER BY id LIMIT ? OFFSET ?`,
    [...params, limit + 1, offset]
  );

  const persons = rows as Person[];
  const hasNext = persons.length > limit;

  return {
    items: persons.slice(0, limit),
    hasNext,
  };
}

export async function insertPerson(
  id: number,
  age: number,
  name: string
): Promise<Person> {
  await getPool().query(
    "INSERT INTO persons (id, age, name, selected) VALUES (?, ?, ?, false)",
    [id, age, name]
  );

  return { id, age, name, selected: false };
}

export async function updatePersonSelected(
  id: number,
  selected: boolean
): Promise<Person | null> {
  const [updateResult] = await getPool().query(
    "UPDATE persons SET selected = ? WHERE id = ?",
    [selected, id]
  );
  const affectedRows = (updateResult as { affectedRows: number }).affectedRows;

  if (!affectedRows) {
    return null;
  }

  const [rows] = await getPool().query(
    "SELECT id, age, name, selected FROM persons WHERE id = ?",
    [id]
  );
  const person = (rows as Person[])[0];

  if (!person) {
    return null;
  }

  return {
    ...person,
    selected: Boolean(person.selected),
  };
}
