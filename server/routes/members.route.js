import { Router } from "express";
import { apiWrapper } from "../services/request";
import {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
} from "../controllers/members.controller";
import {
  getUserSubscriptions,
  addUserSubscription,
  deleteUserSubscription,
} from "../controllers/subscriptions.controller";

const router = Router();

router.get(
  "/",
  async (req, res) => await apiWrapper(req, res, getAllMembers, "get")
);

router.get(
  "/:id",
  async (req, res) => await apiWrapper(req, res, getMemberById, "get")
);

router.post(
  "/",
  async (req, res) => await apiWrapper(req, res, addMember, "post")
);

router.put(
  "/:id",
  async (req, res) => await apiWrapper(req, res, updateMember, "put")
);

router.delete(
  "/:id",
  async (req, res) => await apiWrapper(req, res, deleteMember, "delete")
);

router.get(
  "/:id/movies",
  async (req, res) => await apiWrapper(req, res, getUserSubscriptions)
);
router.post(
  "/:id/movies",
  async (req, res) => await apiWrapper(req, res, addUserSubscription, "put")
);
router.delete("/subscription/:id",
  async (req, res) => await apiWrapper(req, res, deleteUserSubscription, "put")
);

export default router;
