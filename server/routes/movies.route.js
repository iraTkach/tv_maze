import { Router } from "express";
import { apiWrapper } from "../services/request";
import { getAllMovies, getMovieById, addMovie, updateMovie,deleteMovie } from "../controllers/movies.controller";

const router = Router();

router.get("/", async (req, res) => await apiWrapper(req, res, getAllMovies));

router.get("/:id", async (req, res) => await apiWrapper(req, res, getMovieById));

router.post("/", async (req, res) => await apiWrapper(req, res, addMovie, "post"));

router.put("/:id", async (req, res) => await apiWrapper(req, res, updateMovie, "put"));

router.delete("/:id", async (req, res) => await apiWrapper(req, res, deleteMovie, "delete"));

export default router;
