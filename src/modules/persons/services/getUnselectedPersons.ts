import { withSelected } from "../lib/withSelected.js";
import { findUnselectedPersons } from "../persons.repository.js";
import * as personsState from "../persons.state.js";
import type { ParsedPersonsQuery, PersonsPage } from "../persons.types.js";

export async function getUnselectedPersons(
  query: ParsedPersonsQuery
): Promise<PersonsPage> {
  const result = await findUnselectedPersons(
    query.limit,
    query.offset,
    personsState.getSelectedOrder(),
    query.id
  );

  return {
    items: result.items.map((person) => withSelected(person, false)),
    hasNext: result.hasNext,
  };
}
