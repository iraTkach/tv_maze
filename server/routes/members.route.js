import { Router } from "express";
import { apiWrapper } from "../services/request";
import { getAllMembers, getMemberById, addMember, updateMember,deleteMember } from "../controllers/members.controller";

const router = Router();

router.get("/", async (req, res) => await apiWrapper(req, res, getAllMembers, 'get'));

router.get("/:id", async (req, res) => await apiWrapper(req, res, getMemberById, 'get'));

router.post("/", async (req, res) => await apiWrapper(req, res, addMember, 'post'));

router.put("/:id", async (req, res) => await apiWrapper(req, res, updateMember, 'put'));

router.delete("/:id", async (req, res) => await apiWrapper(req, res, deleteMember, 'delete'));


export default router;
