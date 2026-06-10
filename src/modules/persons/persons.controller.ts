import type { Request, Response } from "express";
import { isDuplicateEntryError } from "../../share/lib/errors/isDuplicateEntryError.js";
import { parsePersonsQuery } from "./lib/parsePersonsQuery.js";
import {
  createPerson,
  getSelectedPersons as fetchSelectedPersons,
  getUnselectedPersons as fetchUnselectedPersons,
  reorderSelectedPersons,
  updatePersonSelected,
} from "./persons.service.js";

function getPersonsQuery(req: Request) {
  return parsePersonsQuery({
    page: req.query.page,
    limit: req.query.limit,
    id: req.query.id,
  });
}

export async function getUnselectedPersons(req: Request, res: Response) {
  const persons = await fetchUnselectedPersons(getPersonsQuery(req));
  res.json(persons);
}

export async function getSelectedPersons(req: Request, res: Response) {
  const persons = await fetchSelectedPersons(getPersonsQuery(req));
  res.json(persons);
}

export async function patchPersonSelected(req: Request, res: Response) {
  const id = Number(req.params.id);
  const selected = req.body?.selected;

  if (Number.isNaN(id) || typeof selected !== "boolean") {
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
    ids.some((id) => Number.isNaN(Number(id)))
  ) {
    res.status(400).json({ error: "Invalid ids" });
    return;
  }

  await reorderSelectedPersons({
    ids: ids.map((id) => Number(id)),
  });

  res.status(204).send();
}

export async function postPerson(req: Request, res: Response) {
  const id = Number(req.body?.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const person = await createPerson({ id });
    res.status(201).json(person);
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      res.status(409).json({ error: "Person with this id already exists" });
      return;
    }

    throw error;
  }
}
