import { Role } from "@prisma/client";
import express from "express";
import {
  approveRoleRequest,
  denyRoleRequest,
  getRoleRequests,
  roleRequestQuerySchema,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";

const router = express.Router();

/**
 * Tất cả các routes dưới đây yêu cầu quyền ADMIN
 */
router.use(authMiddleware([Role.ADMIN]));

/**
 * Lấy danh sách các yêu cầu nâng cấp quyền
 */
router.get(
  "/role-requests",
  validate(roleRequestQuerySchema, "query"),
  getRoleRequests
);

/**
 * Phê duyệt yêu cầu nâng cấp quyền
 */
router.put("/role-requests/:requestId/approve", approveRoleRequest);

/**
 * Từ chối yêu cầu nâng cấp quyền
 */
router.put("/role-requests/:requestId/deny", denyRoleRequest);

export default router;
