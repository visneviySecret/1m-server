import { withSelected } from "../lib/withSelected.js";
import { findPersonById } from "../persons.repository.js";
import * as personsState from "../persons.state.js";
import type { Person, UpdatePersonSelectedParams } from "../persons.types.js";

export async function updatePersonSelected(
  params: UpdatePersonSelectedParams
): Promise<Person | null> {
  const person = await findPersonById(params.id);

  if (!person) {
    return null;
  }

  personsState.setSelected(params.id, params.selected);

  return withSelected(person, params.selected);
}
