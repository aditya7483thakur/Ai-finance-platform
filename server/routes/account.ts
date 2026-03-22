import express from "express";
import {
  createAccount,
  deleteAccount,
  getAllAccounts,
  getSingleAccount,
  updateAccount,
} from "../controllers/account.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/create-account", rateLimiter(5), createAccount);
router.get("/get-all-accounts/:userId", getAllAccounts);
router.patch("/update-account", rateLimiter(2), updateAccount);
router.delete("/delete-account/:id", rateLimiter(5), deleteAccount);
router.get("/get-account/:accountId", getSingleAccount);

export default router;
