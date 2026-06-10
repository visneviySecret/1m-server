import { getSelectedPersons } from "../services/getSelectedPersons.js";
import { getUnselectedPersons } from "../services/getUnselectedPersons.js";
import { reorderSelectedPersons } from "../services/reorderSelectedPersons.js";
import { updatePersonSelected } from "../services/updatePersonSelected.js";
import type {
  ParsedPersonsQuery,
  Person,
  PersonsPage,
  ReorderSelectedPersonsParams,
  UpdatePersonSelectedParams,
} from "../persons.types.js";
import { RequestBatcher } from "../../../share/lib/RequestBatcher.js";

export type ReadUpdateTask =
  | { type: "getSelected"; query: ParsedPersonsQuery }
  | { type: "getUnselected"; query: ParsedPersonsQuery }
  | { type: "updateSelected"; params: UpdatePersonSelectedParams }
  | { type: "reorder"; params: ReorderSelectedPersonsParams };

export type ReadUpdateResult =
  | { type: "getSelected"; data: PersonsPage }
  | { type: "getUnselected"; data: PersonsPage }
  | { type: "updateSelected"; data: Person | null }
  | { type: "reorder" };

function getReadUpdateKey(task: ReadUpdateTask) {
  switch (task.type) {
    case "getSelected":
      return `getSelected:${task.query.page}:${task.query.limit}:${task.query.offset}:${task.query.id ?? ""}`;
    case "getUnselected":
      return `getUnselected:${task.query.page}:${task.query.limit}:${task.query.offset}:${task.query.id ?? ""}`;
    case "updateSelected":
      return `updateSelected:${task.params.id}`;
    case "reorder":
      return "reorder";
  }
}

async function processReadUpdateBatch(tasks: ReadUpdateTask[]) {
  const results = new Map<string, ReadUpdateResult>();
  const uniqueTasks = new Map<string, ReadUpdateTask>();

  for (const task of tasks) {
    uniqueTasks.set(getReadUpdateKey(task), task);
  }

  for (const [key, task] of uniqueTasks) {
    switch (task.type) {
      case "getSelected":
        results.set(key, {
          type: "getSelected",
          data: await getSelectedPersons(task.query),
        });
        break;
      case "getUnselected":
        results.set(key, {
          type: "getUnselected",
          data: await getUnselectedPersons(task.query),
        });
        break;
      case "updateSelected":
        results.set(key, {
          type: "updateSelected",
          data: await updatePersonSelected(task.params),
        });
        break;
      case "reorder":
        await reorderSelectedPersons(task.params);
        results.set(key, { type: "reorder" });
        break;
    }
  }

  return results;
}

export const readUpdateBatcher = new RequestBatcher(
  1_000,
  getReadUpdateKey,
  processReadUpdateBatch
);
