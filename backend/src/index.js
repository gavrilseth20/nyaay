import "dotenv/config";
import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routes/auth.js";
import auditRoutes from "./routes/audits.js";
import uploadRoutes from "./routes/uploads.js";
import reportRoutes from "./routes/reports.js";
import modelAuditRoutes from "./routes/modelAudits.js";
import { verifyToken } from "./middleware/verifyToken.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "10mb" }));
if (process.env.CLERK_SECRET_KEY) app.use(clerkMiddleware());

app.get("/health", (_req, res) => res.json({ ok: true, service: "nyaay-backend" }));
app.use("/api/auth", verifyToken, authRoutes);
app.use("/api/uploads", verifyToken, uploadRoutes);
app.use("/api/audits", verifyToken, auditRoutes);
app.use("/api/reports", verifyToken, reportRoutes);
app.use("/api/model-audits", verifyToken, modelAuditRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || "Internal server error" });
});

app.listen(port, () => console.log(`Nyaay API listening on ${port}`));
