import { Router } from "express";
import { apiWrapper } from "../services/request";

import {
  deleteSubscription,
} from "../controllers/subscriptions.controller";

const router = Router();

router.delete("/:id",
  async (req, res) => await apiWrapper(req, res, deleteSubscription, "put")
);

export default router;
