import express from "express";
import {
  createClerkUser,
  deleteClerkUser,
  getClerkUser,
  updateClerkUser,
} from "../controllers/user.js";

const router = express.Router();

router.post("/create-user", createClerkUser);
router.post("/update-user", updateClerkUser);
router.post("/delete-user", deleteClerkUser);
router.get("/get-user-id/:clerkUserId", getClerkUser);

export default router;
