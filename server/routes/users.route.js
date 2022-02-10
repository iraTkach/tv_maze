import { Router } from "express";
import { apiWrapper } from "../services/request";
import {
  getAllUsers,
  getUsersJson,
  getUserJson,
  getUserById,
  addUser,
  addUserAdmin,
  updateUser,
  deleteUser,
  getUserPermsJson
} from "../controllers/users.controller";

import { login, logout, register } from "../controllers/authenticate.controller";

const router = Router();
router.get("/", async (req, res) => await apiWrapper(req, res, getAllUsers));

router.get("/:id", async (req, res) => await apiWrapper(req, res, getUserById));

router.put(
  "/register",
  async (req, res) => await apiWrapper(req, res, register, "post")
);

router.post(
  "/authenticate",
  async (req, res) => await apiWrapper(req, res, login, "post")
);

router.post(
  "/logout",
  async (req, res) => await apiWrapper(req, res, logout, "post")
);

router.post(
  "/json",
  async (req, res) => await apiWrapper(req, res, getUsersJson, "post")
);

router.post(
  "/json/:id",
  async (req, res) => await apiWrapper(req, res, getUserJson, "post")
);

router.post(
  "/permissions/:id",
  async (req, res) => await apiWrapper(req, res, getUserPermsJson, "post")
);

router.post(
  "/admin",
  async (req, res) => await apiWrapper(req, res, addUserAdmin, "post")
);

router.post(
  "/",
  async (req, res) => await apiWrapper(req, res, addUser, "post")
);

router.put(
  "/:id",
  async (req, res) => await apiWrapper(req, res, updateUser, "put")
);

router.delete(
  "/:id",
  async (req, res) => await apiWrapper(req, res, deleteUser, "delete")
);

export default router;
