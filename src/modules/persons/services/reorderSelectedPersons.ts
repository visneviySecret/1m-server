import * as personsState from "../persons.state.js";
import type { ReorderSelectedPersonsParams } from "../persons.types.js";

export async function reorderSelectedPersons(
  params: ReorderSelectedPersonsParams
) {
  personsState.reorderSelected(params.ids);
}
