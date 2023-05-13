import { Router } from "express";
import { deleteRental, insertRental ,getRentals, finalizeRental} from "../Controllers/rentals.controllers.js";
import rentalSchema from "../Schemas/rentalSchema.js";
import validateSchema from "../Middleware/validateSchema.js";

const rentalsRouter= Router();

rentalsRouter.post("/rentals", validateSchema(rentalSchema), insertRental)
rentalsRouter.delete("/rentals/:id", deleteRental)
rentalsRouter.get("/rentals",getRentals)
rentalsRouter.post("/rentals/:id/return", finalizeRental)

export default rentalsRouter;