import type { Request, Response } from "express";
import { isDuplicateEntryError } from "../../share/lib/errors/isDuplicateEntryError.js";
import { parsePersonsQuery } from "./lib/parsePersonsQuery.js";
import {
  createPerson,
  getSelectedPersons,
  getUnselectedPersons,
  reorderSelectedPersons,
  updatePersonSelected,
} from "./persons.service.js";
import { batch } from "../../share/lib/batch.js";

function getPersonsQuery(req: Request) {
  return parsePersonsQuery({
    page: req.query.page,
    limit: req.query.limit,
    id: req.query.id,
  });
}

export async function getUnselectedPersonsHandler(req: Request, res: Response) {
  const data = await getUnselectedPersons(getPersonsQuery(req));
  res.json(data);
}

export async function getSelectedPersonsHandler(req: Request, res: Response) {
  const data = await getSelectedPersons(getPersonsQuery(req));
  res.json(data);
}

export async function patchPersonSelected(req: Request, res: Response) {
  const id = req.params.id;
  const selected = req.body?.selected;

  if (
    typeof id !== "string" ||
    id.trim() === "" ||
    typeof selected !== "boolean"
  ) {
    res.status(400).json({ error: "Invalid id or selected status" });
    return;
  }

  const person = await updatePersonSelected({ id, selected });

  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  res.json(person);
}

export async function putSelectedPersonsOrder(req: Request, res: Response) {
  const ids = req.body?.ids;

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some((id) => String(id).trim() === "")
  ) {
    res.status(400).json({ error: "Invalid ids" });
    return;
  }

  await reorderSelectedPersons({
    ids: ids.map((id) => String(id)),
  });

  res.status(204).send();
}

export async function postPersonHandler(req: Request, res: Response) {
  await batch(() => postPerson(req, res));
}

async function postPerson(req: Request, res: Response) {
  const id = req.body?.id;

  if (id == null || String(id).trim() === "") {
    res.status(400).json({ error: "Id should't be empty" });
    return;
  }

  try {
    const person = await createPerson({ id: String(id) });
    res.status(201).json(person);
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      res.status(409).json({ error: "Person with this id already exists" });
      return;
    }
  }
}
