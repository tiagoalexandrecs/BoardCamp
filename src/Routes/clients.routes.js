import { Router } from "express";
import { getClients,getClientById,insertClient, updateClient } from "../Controllers/clients.controllers.js";
import validateSchema from "../Middleware/validateSchema.js";
import clientSchema from "../Schemas/clientSchema.js";


const clientsRouter=Router()

clientsRouter.get("/customers", getClients)
clientsRouter.get("/customers/:id",getClientById)
clientsRouter.post("/customers", validateSchema(clientSchema), insertClient)
clientsRouter.put("/customers/:id", validateSchema(clientSchema), updateClient)

export default clientsRouter;