import { generatePersonFields } from "../../share/lib/generatePersonFields.js";
import {
  findPersons,
  insertPerson,
  updatePersonSelected as updatePersonSelectedInDb,
} from "./persons.repository.js";
import type {
  CreatePersonParams,
  GetPersonsParams,
  UpdatePersonSelectedParams,
} from "./persons.types.js";

export async function createPerson(params: CreatePersonParams) {
  const { age, name } = generatePersonFields();

  return insertPerson(params.id, age, name);
}

export async function updatePersonSelected(params: UpdatePersonSelectedParams) {
  return updatePersonSelectedInDb(params.id, params.selected);
}

export async function getPersons(params: GetPersonsParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(1000, Math.max(1, Number(params.limit) || 20));
  const offset = (page - 1) * limit;
  const parsedId = Number(params.id);
  const id = !Number.isNaN(parsedId) ? parsedId : undefined;

  return findPersons(limit, offset, params.selected, id);
}
