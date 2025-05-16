import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import {
  approveRoleRequest,
  denyRoleRequest,
  getRoleRequests,
} from "../controllers/admin.controller";

const router = express.Router();

// All admin routes below require ADMIN role
router.use(authMiddleware([Role.ADMIN]));

router.get("/role-requests", getRoleRequests);
router.put("/role-requests/:requestId/approve", approveRoleRequest);
router.put("/role-requests/:requestId/deny", denyRoleRequest);

export default router;
