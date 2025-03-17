import express from "express";
import {
  createClerkUser,
  deleteClerkUser,
  updateClerkUser,
} from "../controllers/user.js";

const router = express.Router();

router.post("/create-user", createClerkUser);
router.post("/update-user", updateClerkUser);
router.post("/delete-user", deleteClerkUser);

export default router;
