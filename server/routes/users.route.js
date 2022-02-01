import { Router } from "express";
import { apiWrapper } from "../services/request";
import { getAllUsers } from "./../controllers/users.controller";

const router = Router();

router.get("/", async (req, res) => await apiWrapper(res, getAllUsers));

export default router;
