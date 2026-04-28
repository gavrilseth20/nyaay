import express from "express";
import { createUser } from "../services/firestoreService.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { uid, orgName, email, role } = req.body;
    await createUser(uid, { orgName, email, role });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;
