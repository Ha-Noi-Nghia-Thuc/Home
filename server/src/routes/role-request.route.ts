import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { requestAuthorRole } from "../controllers/role-request.controller";

const router = express.Router();

router.post("/request-author", authMiddleware([Role.USER]), requestAuthorRole);

export default router;
