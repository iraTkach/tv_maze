import express, { json } from "express";
import cors from "cors";
import membersRouter from "./routes/members.route";
import usersRouter from "./routes/users.route";
import moviesRouter from "./routes/movies.route";
import connectDB from './services/config/database';
import { setAllMembers } from './controllers/members.controller';
import { setAllMovies } from './controllers/movies.controller';

const app = express();
app.use(cors());
app.use(json());

connectDB();

app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/members", membersRouter);


app.listen(8000, () => console.log(`app is listening on port 8000`));

setAllMembers();
setAllMovies();
