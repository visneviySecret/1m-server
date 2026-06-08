import { Router } from "express";
import { asyncHandler } from "../../app/middleware/asyncHandler.js";
import { getPersonsHandler } from "./persons.controller.js";

export const personsRouter = Router();

personsRouter.get("/persons", asyncHandler(getPersonsHandler));
