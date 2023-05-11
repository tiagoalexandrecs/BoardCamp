import { Router } from "express"
import gamesRouter from "./games.routes.js"
import clientsRouter from "./clients.routes.js"

const router = Router()

router.use(gamesRouter)
router.use(clientsRouter)

export default router;