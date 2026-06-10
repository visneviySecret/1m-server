import type { Request, Response } from "express";
import { getPersons } from "./persons.service.js";

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
