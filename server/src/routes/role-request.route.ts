import { Role } from "@prisma/client";
import express from "express";
import {
  requestAuthorRole,
  getMyRoleRequests,
  cancelRoleRequest,
  createRoleRequestSchema,
} from "../controllers/role-request.controller";
import {
  authMiddleware,
  isAuthenticated,
} from "../middlewares/auth.middleware";
import { validate, validateId } from "../middlewares/validation.middleware";

const router = express.Router();

/**
 * Yêu cầu nâng cấp quyền lên Author (chỉ USER mới có thể yêu cầu)
 */
router.post(
  "/request-author",
  authMiddleware([Role.USER]),
  validate(createRoleRequestSchema),
  requestAuthorRole
);

/**
 * Lấy danh sách yêu cầu của người dùng hiện tại
 */
router.get("/my-role-requests", isAuthenticated, getMyRoleRequests);

/**
 * Hủy yêu cầu nâng cấp quyền (chỉ hủy được trạng thái PENDING)
 */
router.delete("/role-requests/:requestId", isAuthenticated, cancelRoleRequest);

export default router;
