import express from "express";
import multer from "multer";
import { db, firebaseAdmin } from "../firebase.js";
import { uploadBuffer } from "../services/storageService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const orgId = req.user.orgId || req.user.uid;
    const uploadId = db.collection("uploads").doc().id;
    const storagePath = `orgs/${orgId}/uploads/${uploadId}-${req.file.originalname}`;
    const gsPath = await uploadBuffer({ buffer: req.file.buffer, destination: storagePath, contentType: req.file.mimetype });
    await db.collection("uploads").doc(uploadId).set({
      orgId,
      fileName: req.file.originalname,
      storagePath: gsPath,
      rowCount: Number(req.body.rowCount || 0),
      columnMapping: {},
      uploadedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ uploadId, storagePath: gsPath });
  } catch (error) {
    next(error);
  }
});

router.get("/:uploadId", async (req, res, next) => {
  try {
    const doc = await db.collection("uploads").doc(req.params.uploadId).get();
    if (!doc.exists) return res.status(404).json({ error: "Upload not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
});

export default router;
