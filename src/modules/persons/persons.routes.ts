import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getSelectedPersons,
  getUnselectedPersons,
  patchPersonSelected,
  postPerson,
  putSelectedPersonsOrder,
} from "./persons.controller.js";

export const personsRouter = Router();

personsRouter.get("/persons/unselected", asyncHandler(getUnselectedPersons));
personsRouter.get("/persons/selected", asyncHandler(getSelectedPersons));
personsRouter.put(
  "/persons/selected/order",
  asyncHandler(putSelectedPersonsOrder)
);
personsRouter.post("/persons", asyncHandler(postPerson));
personsRouter.patch("/persons/:id", asyncHandler(patchPersonSelected));
