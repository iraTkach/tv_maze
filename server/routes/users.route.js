import { Router } from "express";
import { apiWrapper } from "../services/request";
import { getAllUsers, getUserById, addUser, addUserAdmin, updateUser, deleteUser } from "../controllers/users.controller";

const router = Router();
router.get("/", async (req, res) => await apiWrapper(req, res, getAllUsers));

router.get("/:id", async (req, res) => await apiWrapper(req, res, getUserById));

router.post("/admin/", async (req, res) => await apiWrapper(req, res, addUserAdmin, "post"));

router.post("/", async (req, res) => await apiWrapper(req, res, addUser, "post"));

router.put("/:id", async (req, res) => await apiWrapper(req, res, updateUser, "put"));

router.delete("/:id", async (req, res) => await apiWrapper(req, res, deleteUser, "delete"));




export default router;
