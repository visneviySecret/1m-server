import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getSelectedPersons,
  getUnselectedPersons,
  patchPersonSelected,
  postPerson,
} from "./persons.controller.js";

export const personsRouter = Router();

personsRouter.get("/persons/unselected", asyncHandler(getUnselectedPersons));
personsRouter.get("/persons/selected", asyncHandler(getSelectedPersons));
personsRouter.post("/persons", asyncHandler(postPerson));
personsRouter.patch("/persons/:id", asyncHandler(patchPersonSelected));
