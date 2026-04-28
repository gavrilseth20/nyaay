import { db, firebaseAdmin } from "../firebase.js";

export async function createUser(uid, payload) {
  await db.collection("users").doc(uid).set({
    ...payload,
    role: payload.role || "admin",
    createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

export async function createAudit(orgId, payload) {
  const ref = db.collection("audits").doc();
  await ref.set({
    orgId,
    status: "pending",
    createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    ...payload
  });
  return { id: ref.id, ...(await ref.get()).data() };
}

export async function listAudits(orgId) {
  const snapshot = await db.collection("audits").where("orgId", "==", orgId).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateAudit(id, payload) {
  await db.collection("audits").doc(id).set(payload, { merge: true });
  return { id, ...(await db.collection("audits").doc(id).get()).data() };
}
