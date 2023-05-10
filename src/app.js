import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

//criar o env DATABASE_URL=mongodb://localhost:27017/moodboard
const port = process.env.PORT;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));