import { filterIdsBySearch } from "../lib/filterIdsBySearch.js";
import { withSelected } from "../lib/withSelected.js";
import { findPersonsByIds } from "../persons.repository.js";
import * as personsState from "../persons.state.js";
import type { ParsedPersonsQuery, PersonsPage } from "../persons.types.js";

export async function getSelectedPersons(
  query: ParsedPersonsQuery
): Promise<PersonsPage> {
  const orderedIds = filterIdsBySearch(
    personsState.getSelectedOrder(),
    query.id
  );
  const pageIds = orderedIds.slice(query.offset, query.offset + query.limit);
  const persons = await findPersonsByIds(pageIds);

  return {
    items: persons.map((person) => withSelected(person, true)),
    hasNext: orderedIds.length > query.offset + query.limit,
  };
}
