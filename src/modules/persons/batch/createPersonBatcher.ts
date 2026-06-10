import { isDuplicateEntryError } from "../../../share/lib/errors/isDuplicateEntryError.js";
import { createPerson } from "../services/createPerson.js";
import type { Person } from "../persons.types.js";
import { RequestBatcher } from "../../../share/lib/RequestBatcher.js";

export type CreatePersonBatchPayload = {
  id: string;
};

export type CreatePersonBatchResult =
  | { status: "created"; person: Person }
  | { status: "duplicate" }
  | { status: "error"; message: string };

function normalizeCreateId(id: string) {
  return String(id).trim();
}

async function processCreatePersonBatch(
  payloads: CreatePersonBatchPayload[]
) {
  const results = new Map<string, CreatePersonBatchResult>();
  const uniqueIds = new Map<string, string>();

  for (const payload of payloads) {
    const id = normalizeCreateId(payload.id);
    uniqueIds.set(id, id);
  }

  for (const id of uniqueIds.values()) {
    try {
      const person = await createPerson({ id });
      results.set(id, { status: "created", person });
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        results.set(id, { status: "duplicate" });
        continue;
      }

      const message =
        error instanceof Error ? error.message : "Failed to create person";
      results.set(id, { status: "error", message });
    }
  }

  return results;
}

export const createPersonBatcher = new RequestBatcher(
  10_000,
  (payload) => normalizeCreateId(payload.id),
  processCreatePersonBatch
);
