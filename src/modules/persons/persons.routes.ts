import { Router } from "express";
import { asyncHandler } from "../../app/middleware/asyncHandler.js";
import {
  getSelectedPersons,
  getUnselectedPersons,
} from "./persons.controller.js";

export const personsRouter = Router();

personsRouter.get("/persons/unselected", asyncHandler(getUnselectedPersons));
personsRouter.get("/persons/selected", asyncHandler(getSelectedPersons));
