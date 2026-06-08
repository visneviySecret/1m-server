import { Router } from "express";
import { personsRouter } from "../modules/persons/persons.routes.js";

export const appRouter = Router();

appRouter.use(personsRouter);
