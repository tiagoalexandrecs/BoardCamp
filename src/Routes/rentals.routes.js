import { Router } from "express";
import { deleteRental, insertRental } from "../Controllers/rentals.controllers.js";
import rentalSchema from "../Schemas/rentalSchema.js";
import validateSchema from "../Middleware/validateSchema.js";

const rentalsRouter= Router();

rentalsRouter.post("/rentals", validateSchema(rentalSchema), insertRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter;