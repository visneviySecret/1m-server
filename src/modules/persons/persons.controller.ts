import type { Request, Response } from "express";
import { isDuplicateEntryError } from "../../share/lib/errors/isDuplicateEntryError.js";
import {
  createPerson,
  getPersons,
  updatePersonSelected,
} from "./persons.service.js";

async function getPersonsBySelected(
  req: Request,
  res: Response,
  selected: boolean
) {
  const persons = await getPersons({
    page: req.query.page,
    limit: req.query.limit,
    id: req.query.id,
    selected,
  });
  res.json(persons);
}

export async function getUnselectedPersons(req: Request, res: Response) {
  await getPersonsBySelected(req, res, false);
}

export async function getSelectedPersons(req: Request, res: Response) {
  await getPersonsBySelected(req, res, true);
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
