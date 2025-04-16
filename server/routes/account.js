import express from "express";
import {
  createAccount,
  deleteAccount,
  getAllAccounts,
  getSingleAccount,
  updateAccount,
} from "../controllers/account.js";

const router = express.Router();

router.post("/create-account", createAccount);
router.get("/get-all-accounts/:userId", getAllAccounts);
router.patch("/update-account", updateAccount);
router.delete("/delete-account/:id", deleteAccount);
router.get("/get-account/:accountId", getSingleAccount);

export default router;
