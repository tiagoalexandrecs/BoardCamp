import express from "express";
import cors from "cors";
import router from "./Routes/index.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));