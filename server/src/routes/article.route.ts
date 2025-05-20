import { Role } from "@prisma/client";
import express from "express";
import {
  createArticle,
  createArticleSchema,
  deleteArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  updateArticleSchema,
} from "../controllers/article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateId } from "../middlewares/validation.middleware";

const router = express.Router();

// Routes công khai - Không yêu cầu xác thực
router.get("/", getAllArticles);
router.get("/:id", validateId, getArticleById);

// Routes yêu cầu quyền ADMIN hoặc AUTHOR
router.post(
  "/",
  authMiddleware([Role.ADMIN, Role.AUTHOR]),
  validate(createArticleSchema),
  createArticle
);
router.put(
  "/:id",
  validateId,
  authMiddleware([Role.ADMIN, Role.AUTHOR]),
  validate(updateArticleSchema),
  updateArticle
);
router.delete(
  "/:id",
  validateId,
  authMiddleware([Role.ADMIN, Role.AUTHOR]),
  deleteArticle
);

export default router;
