import { getPool } from "../../database/db.js";
import type { PersonData, PersonsDataPage } from "./persons.types.js";

export async function findPersonById(id: string | number): Promise<PersonData | null> {
  const [rows] = await getPool().query(
    "SELECT id, age, name FROM persons WHERE id = ?",
    [id]
  );
  const person = (rows as PersonData[])[0];

  if (!person) {
    return null;
  }

  return person;
}

export async function findPersonsByIds(ids: number[]): Promise<PersonData[]> {
  if (ids.length === 0) {
    return [];
  }

  const [rows] = await getPool().query(
    `SELECT id, age, name FROM persons WHERE id IN (${ids.map(() => "?").join(", ")})`,
    ids
  );
  const personsMap = new Map(
    (rows as PersonData[]).map((person) => [person.id, person])
  );

  return ids
    .map((id) => personsMap.get(id))
    .filter((person): person is PersonData => person !== undefined);
}

export async function findUnselectedPersons(
  limit: number,
  offset: number,
  excludedIds: number[],
  id?: string
): Promise<PersonsDataPage> {
  const conditions: string[] = [];
  const params: (number | string)[] = [];

  if (excludedIds.length > 0) {
    conditions.push(`id NOT IN (${excludedIds.map(() => "?").join(", ")})`);
    params.push(...excludedIds);
  }

  if (id !== undefined) {
    conditions.push("CAST(id AS CHAR) LIKE ?");
    params.push(`%${id}%`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await getPool().query(
    `SELECT id, age, name FROM persons ${whereClause} ORDER BY id LIMIT ? OFFSET ?`,
    [...params, limit + 1, offset]
  );

  const persons = rows as PersonData[];
  const hasNext = persons.length > limit;

  return {
    items: persons.slice(0, limit),
    hasNext,
  };
}

export async function insertPerson(
  id: string,
  age: number,
  name: string
): Promise<PersonData> {
  await getPool().query(
    "INSERT INTO persons (id, age, name) VALUES (?, ?, ?)",
    [id, age, name]
  );

  const person = await findPersonById(id);

  if (!person) {
    throw new Error("Failed to load created person");
  }

  return person;
}
