import express from "express";
import {
  createUser,
  createUserSchema,
  getUser,
  updateUser,
  updateUserSchema,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  validate,
  validateCognitoId,
} from "../middlewares/validation.middleware";

const router = express.Router();

// Các API route công khai để xử lý đăng ký
router.post("/", validate(createUserSchema), createUser);

// Các API route yêu cầu xác thực
router.get("/:cognitoId", validateCognitoId, isAuthenticated, getUser);
router.put(
  "/:cognitoId",
  validateCognitoId,
  validate(updateUserSchema),
  isAuthenticated,
  updateUser
);

export default router;
