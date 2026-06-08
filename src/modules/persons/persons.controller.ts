import type { Request, Response } from "express";
import { getPersons } from "./persons.service.js";

export async function getPersonsHandler(req: Request, res: Response) {
  const persons = await getPersons({
    page: req.query.page,
    limit: req.query.limit,
  });
  res.json(persons);
}
