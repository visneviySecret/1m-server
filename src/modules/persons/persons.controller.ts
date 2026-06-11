import type { Request, Response } from "express";
import {
  createPersonBatcher,
  type CreatePersonBatchResult,
} from "./batch/createPersonBatcher.js";
import {
  readUpdateBatcher,
  type ReadUpdateResult,
} from "./batch/readUpdateBatcher.js";
import { parsePersonsQuery } from "./lib/parsePersonsQuery.js";

function getPersonsQuery(req: Request) {
  return parsePersonsQuery({
    page: req.query.page,
    limit: req.query.limit,
    id: req.query.id,
  });
}

function sendCreatePersonResult(
  res: Response,
  result: CreatePersonBatchResult
) {
  if (result.status === "created") {
    res.status(201).json(result.person);
    return;
  }

  if (result.status === "duplicate") {
    res.status(409).json({ error: "Person with this id already exists" });
    return;
  }

  res.status(500).json({ error: result.message });
}

function sendReadUpdateResult(res: Response, result: ReadUpdateResult) {
  switch (result.type) {
    case "getSelected":
    case "getUnselected":
      res.json(result.data);
      return;
    case "updateSelected":
      if (!result.data) {
        res.status(404).json({ error: "Person not found" });
        return;
      }

      res.json(result.data);
      return;
    case "reorder":
      res.status(204).send();
      return;
  }
}

export async function getUnselectedPersons(req: Request, res: Response) {
  const result = await readUpdateBatcher.run({
    type: "getUnselected",
    query: getPersonsQuery(req),
  });

  sendReadUpdateResult(res, result);
}

export async function getSelectedPersons(req: Request, res: Response) {
  const result = await readUpdateBatcher.run({
    type: "getSelected",
    query: getPersonsQuery(req),
  });

  sendReadUpdateResult(res, result);
}

export async function patchPersonSelected(req: Request, res: Response) {
  const id = req.params.id;
  const selected = req.body?.selected;

  if (typeof id !== "string" || id.trim() === "" || typeof selected !== "boolean") {
    res.status(400).json({ error: "Invalid id or selected status" });
    return;
  }

  const result = await readUpdateBatcher.run({
    type: "updateSelected",
    params: { id, selected },
  });

  sendReadUpdateResult(res, result);
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

  const result = await readUpdateBatcher.run({
    type: "reorder",
    params: {
      ids: ids.map((id) => String(id)),
    },
  });

  sendReadUpdateResult(res, result);
}

export async function postPerson(req: Request, res: Response) {
  const id = req.body?.id;

  if (id == null || String(id).trim() === "") {
    res.status(400).json({ error: "Id should't be empty" });
    return;
  }

  const result = await createPersonBatcher.run({ id: String(id) });
  sendCreatePersonResult(res, result);
}
