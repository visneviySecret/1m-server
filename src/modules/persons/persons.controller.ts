import type { Request, Response } from "express";
import { isDuplicateEntryError } from "../../share/lib/errors/isDuplicateEntryError.js";
import { createPerson, getPersons } from "./persons.service.js";

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
