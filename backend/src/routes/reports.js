import express from "express";
import { db, firebaseAdmin } from "../firebase.js";

const router = express.Router();

router.post("/:auditId/export", async (req, res, next) => {
  try {
    const reportId = db.collection("reports").doc().id;
    await db.collection("reports").doc(reportId).set({
      auditId: req.params.auditId,
      orgId: req.user.orgId || req.user.uid,
      format: req.body.format || "pdf",
      status: "generated",
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ reportId, status: "generated" });
  } catch (error) {
    next(error);
  }
});

export default router;
