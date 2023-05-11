import { Router } from "express";
import { getGames, insertGame } from "../Controllers/games.controllers.js";
import validateSchema from "../Middleware/validateSchema.js";
import gameSchema from "../Schemas/gameSchema.js";

const gamesRouter=Router()

gamesRouter.get("/games",getGames)

gamesRouter.post("/games", validateSchema(gameSchema), insertGame)

export default gamesRouter;