import express from "express";
import {
  createUser,
  getUser,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/:cognitoId", getUser);
router.put("/:cognitoId", updateUser);
router.post("/", createUser);

export default router;
