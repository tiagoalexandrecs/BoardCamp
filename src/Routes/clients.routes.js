import { Router } from "express";
import { getClients,getClientById,insertClient, updateClient } from "../Controllers/clients.controllers.js";
import validateSchema from "../Middleware/validateSchema.js";
import clientSchema from "../Schemas/clientSchema.js";


const clientsRouter=Router()

clientsRouter.get("/customer", getClients)
clientsRouter.get("/customer/:id",getClientById)
clientsRouter.post("/customer", validateSchema(clientSchema), insertClient)
clientsRouter.put("/customer/:id", validateSchema(clientSchema), updateClient)

export default clientsRouter;