import express from "express";
import fetch from "node-fetch";
import { createAudit, listAudits, updateAudit } from "../services/firestoreService.js";
import { db, firebaseAdmin } from "../firebase.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const orgId = req.user.orgId || req.user.uid;
    const audit = await createAudit(orgId, req.body);
    res.status(201).json(audit);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    res.json(await listAudits(req.user.orgId || req.user.uid));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doc = await db.collection("audits").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Audit not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    res.json(await updateAudit(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/run", async (req, res, next) => {
  try {
    await updateAudit(req.params.id, { status: "running", startedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp() });
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const response = await fetch(`${mlUrl}/run-audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, auditId: req.params.id })
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/results", async (req, res, next) => {
  try {
    const doc = await db.collection("audits").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Audit not found" });
    res.json(doc.data().results || {});
  } catch (error) {
    next(error);
  }
});

export default router;
