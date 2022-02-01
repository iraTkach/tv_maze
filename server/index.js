import express, { json } from "express";
import cors from "cors";
import usersRouter from "./routes/users.route";
import connectDB from './services/config/database';

const app = express();
app.use(cors());
app.use(json());

connectDB();

app.use("/api/users", usersRouter);

app.listen(8000, () => console.log(`app is listening on port 8000`));
// http://localhost:8000
