import { getAuth } from "@clerk/express";

export async function verifyToken(req, res, next) {
  if (process.env.ALLOW_DEMO_AUTH === "true") {
    req.user = { uid: "demo-user", email: "demo@nyaay.ai", orgId: "demo-org" };
    return next();
  }

  try {
    const auth = getAuth(req);
    if (!auth.userId) return res.status(401).json({ error: "Missing Clerk session token" });
    req.user = {
      uid: auth.userId,
      orgId: auth.orgId || auth.userId,
      sessionId: auth.sessionId
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Clerk session token" });
  }
}
