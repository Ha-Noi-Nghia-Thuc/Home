import express from "express";
import { createUser, getUser } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:cognitoId", authMiddleware(["USER", "AUTHOR", "ADMIN"]), getUser);
router.post("/", authMiddleware(["USER", "AUTHOR", "ADMIN"]), createUser);

export default router;
