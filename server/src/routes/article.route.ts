import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
} from "../controllers/article.controller";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/:id", getArticleById);

// Protected routes (ADMIN and AUTHOR only)
router.post("/", authMiddleware([Role.ADMIN, Role.AUTHOR]), createArticle);
router.put("/:id", authMiddleware([Role.ADMIN, Role.AUTHOR]), updateArticle);
router.delete("/:id", authMiddleware([Role.ADMIN, Role.AUTHOR]), deleteArticle);

export default router;
