import { generatePersonFields } from "../../../share/lib/generatePersonFields.js";
import { withSelected } from "../lib/withSelected.js";
import { insertPerson } from "../persons.repository.js";
import type { CreatePersonParams, Person } from "../persons.types.js";

export async function createPerson(params: CreatePersonParams): Promise<Person> {
  const { age, name } = generatePersonFields();

  return withSelected(await insertPerson(params.id, age, name), false);
}
