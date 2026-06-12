import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getSelectedPersonsHandler,
  getUnselectedPersonsHandler,
  patchPersonSelected,
  postPerson,
  putSelectedPersonsOrder,
} from "./persons.controller.js";

export const personsRouter = Router();

personsRouter.get("/persons/unselected", asyncHandler(getUnselectedPersonsHandler));
personsRouter.get("/persons/selected", asyncHandler(getSelectedPersonsHandler));
personsRouter.put(
  "/persons/selected/order",
  asyncHandler(putSelectedPersonsOrder)
);
personsRouter.post("/persons", asyncHandler(postPerson));
personsRouter.patch("/persons/:id", asyncHandler(patchPersonSelected));
