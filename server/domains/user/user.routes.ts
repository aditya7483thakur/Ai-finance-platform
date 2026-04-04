import express from "express";
import {
  createAuthUser,
  deleteAuthUser,
  getAuthUser,
  updateAuthUser,
} from "./user.controller.js";

const router = express.Router();

router.post("/create-user", createAuthUser);
router.post("/update-user", updateAuthUser);
router.post("/delete-user", deleteAuthUser);
router.get("/get-user-id/:userId", getAuthUser);

export default router;
