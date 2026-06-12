import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getSelectedPersonsHandler,
  getUnselectedPersonsHandler,
  patchPersonSelected,
  postPersonHandler,
  putSelectedPersonsOrder,
} from "./persons.controller.js";

export const personsRouter = Router();

personsRouter.get(
  "/persons/unselected",
  asyncHandler(getUnselectedPersonsHandler)
);
personsRouter.get("/persons/selected", asyncHandler(getSelectedPersonsHandler));
personsRouter.put(
  "/persons/selected/order",
  asyncHandler(putSelectedPersonsOrder)
);
personsRouter.post("/persons", asyncHandler(postPersonHandler));
personsRouter.patch("/persons/:id", asyncHandler(patchPersonSelected));
